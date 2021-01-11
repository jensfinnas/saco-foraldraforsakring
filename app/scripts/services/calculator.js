app.factory('calculator', function () {
    var service = {};
    /*  Räkna ut grundavdraget i kronor givet en förvärvsinkomst (FFI), dvs månadslön, och
        aktuellt prisbasbelopp (PBB).
    */

    // Prisbasbelopp
    var PBB = 47600;
    // Genomsnittlig kommunal inkomstskatt
    var KI = .3227;

    // Skiktgränser för statlig inkomstskatt
    var SG1 = 523200;  // Nedre skiktgräns
    var SG2 = null; // Övre skiktgräns

    // Barnbidrag per månad
    var BBperManad = 1250;

    function getGA(FFI, jobbManader, PBB) {
        var GA;
        if (FFI < 0.99 * PBB) {
            GA = 0.423 * PBB;
        }
        else if (FFI < 2.72 * PBB) {
            GA = 0.225 * PBB + 0.2 * FFI;
        }
        else if (FFI < 3.11 * PBB) {
            GA = 0.770 * PBB;
        }
        else if (FFI < 7.88 * PBB) {
            GA = 1.081 * PBB - 0.1 * FFI;
        }
        else {
            GA = 0.293 * PBB;
        }
        /*  Grundavdraget avrundas uppåt till närmaste 100-tal
            http://www.skatteverket.se/download/18.18e1b10334ebe8bc8000115152/kapitel_11.pdf
        */
        return Math.ceil( GA / 100 ) * 100 * jobbManader / 12;
    }
    /*  Räkna ut skatten i kronor givet en viss inkomst
    */
    function getSkatt(TI, jobbManader) {
        // Obs! Lön per månad här
        var GA = getGA( TI, jobbManader, PBB );

        return ( TI - GA ) * KI +
            Math.max(0, ( TI - GA - SG1 ) * 0.2 );
    }
    /*  Räkna ut jobbskatteavdraget (JSA) i kronor givet en arbetsinkomst (AI),
        kommunal inkomstskatt (KI) och aktuellt prisbasbelop (PBB).

        OM(
        B7+B9<=0,91*Prisbasbelopp
        MAX(0;(B7+B9-B12)*Kommunalskatt)

        OM
        $B7+B9<=2,94*Prisbasbelopp
        (0,91*Prisbasbelopp+0,332*(B7+B9-0,91*Prisbasbelopp)-$B12)*Kommunalskatt

        OM(
        B7+B9<=8,08*Prisbasbelopp
        (1,584*Prisbasbelopp+0,111*(B7+B9-2,94*Prisbasbelopp)-$B12)*Kommunalskatt

        OM(B7+B9>8,08*Prisbasbelopp
        (2,155*Prisbasbelopp-$B12)*Kommunalskatt))
    */
    function getJSA (AI, GA, KI, PBB) {
        if (AI < 0.91 * PBB) {
            return Math.max( (AI - GA) * KI, 0);
        }
        else if (AI < 3.24 * PBB) {
            return (0.91 * PBB + 0.3405 * ( AI - 0.91 * PBB ) - GA ) * KI;
        }
        else if (AI < 8.08 * PBB) {
            return (1.703 * PBB + 0.128 * ( AI - 3.24 * PBB ) - GA ) * KI;
        }
        else if (AI < 13.54 * PBB) {
            return ( 2.323 * PBB - GA ) * KI;
        }
        else {
            return Math.max( 0, 2.323 * PBB - GA ) * KI - 0.03 * ( AI - 13.54 * PBB );
        }
    }
    /*  Räkna ut föräldrapenningen (FP) per månad givet en månadslön och det aktuella prisbasbeloppet (PBB).
    */
    function getFP(lonManad, PBB) {
        var lonAr = lonManad * 12;
        var FPTak = PBB * 10
        // Om lönen är över inkomsttaket:
        if (lonAr > FPTak) {
            return ( 10 * PBB * 0.97 * 0.8 ) / 365 * 30.4;
        }
        // Om lönen är under inkomsttaket:
        else {
            return (lonAr * 0.8 * 0.97 ) / 365 * 30.4;
        }
    }

    /*  Räkna ut föräldralönen givet en viss månadslön och det aktuella prisbasbeloppet
    */
    function getFL(lonManad, PBB) {
        var lonAr = lonManad * 12;
        var FPTak = PBB * 10;
        // Om lönen är över inkomsttaket:
        if (lonAr > FPTak) {
            return lonManad - 30 * 0.8 * 10 * PBB / 365 - 30 * 0.1 * lonAr / 365;
        }
        // Om lönen är under inkomsttaket:
        else {
            return lonManad - 30 * 0.9 * lonAr / 365;
        }
    }

    /*
    */
    function getForvarvsAvdrag(BFA) {
      if (BFA < 40000) {
        return 0
      }
      else if (BFA <= 240000) {
        return 0.0075 * (BFI - 40000)
      }
      else {
        return 1500
      }
    }

    /* Jämställdhetsbonusen avskaffades 2017, men behåller funktionen ett tag till
    function getJB(ledigaManader, JBdag, JBreserveradeManader) {
        // Antal månader som berättigar till JB
        var manader = Math.min(ledigaManader, 12 - ledigaManader) - JBreserveradeManader;
        return Math.max(manader, 0) * 30 * JBdag;
    }*/

    service.inkomstSpec = function(lonManad, ledigaManader, foraldralonManaderMax) {
        var jobbManader = 12 - ledigaManader;
        var foraldralonManader = Math.min(foraldralonManaderMax, ledigaManader);

        // Total föräldrapenning före skatt
        var FP = getFP( lonManad, PBB ) * ledigaManader;

        // Total föräldralön före skatt
        var FL = getFL( lonManad, PBB ) * foraldralonManader;


        // 1) Månadslön x antal månader + FP per månad x antal månader + FL per månad x antal månader = Total årsinkomst
        var BFI = lonManad * jobbManader + FP + FL;


        // 2) Beräkna Total skatt m.h.a. Total årsinkomst.
        var inkomstskatt = getSkatt( BFI, 12 );

        // 3) Beräkna JSA med:  ”total årsinkomst  minus föräldrapenning under året”.
        // För att räkna ut JSA behöver vi vet grundavdraget
        var GA = getGA( BFI, 12, PBB );
        var JSA = getJSA( (BFI - FP) , GA, KI, PBB );

        // 4) Beräkna förvärvsavdrag (introducerades 2021)
        var forvarvsAvdrag = getForvarvsAvdrag(BFI)

        // 5) Beräkna Slutlig skatt: Total skatt – JSA – förvärvsavdrag
        var inkomstskattEfterAvdrag = inkomstskatt - JSA - forvarvsAvdrag;

        // 6) Beräkna Nettoinkomst: Total årsinkomst – Slutlig skatt
        var nettoInkomst = BFI - inkomstskattEfterAvdrag;

        // 7) Disponibel årsinkomst = Nettoinkomst + barnbidrag + jämställdhetsbonus
        var BB = BBperManad / 2 * 12;
        var disponibelInkomst = nettoInkomst + BB;

        // 8) Beräkna föräldralönsnetto (för visning i graferna)
        var skatteprocentMedAvrag = inkomstskattEfterAvdrag / BFI;
        var FLnetto = FL * (1 - skatteprocentMedAvrag);

        var inkomstSpec = {
            'lonBrutto': {
                label: 'Arbetsinkomst (före skatt)',
                value: lonManad * jobbManader,
                order: 1
            },
            'FP': {
                label: 'Föräldrapenning (före skatt)',
                value: FP,
                order: 2,
            },
            'FL': {
                label: 'Föräldralön (före skatt)',
                value: FL,
                order: 3,
            },
            'FLnetto': {
                label: 'Föräldralön (efter skatt)',
                value: FLnetto,
                order: 3.5,
            },
            'BFI': {
                label: 'Årsinkomst (före skatt)',
                value: BFI,
                order: 4
            },
            'JSA': {
                label: 'Jobbskatteavdrag (per år)',
                value: JSA,
                order: 5
            },
            'GA': {
                label: 'Grundavdrag (per år)',
                value: GA,
                order: 5
            },
            'inkomstskatt': {
                label: 'Inkomstskatt före JSA',
                value: inkomstskatt,
                order: 6,
            },
            'inkomstskattEfterAvdrag': {
                label: 'Inkomstskatt efter avdrag',
                value: inkomstskattEfterAvdrag,
                order: 7,
            },
            'nettoInkomst': {
                label: 'Inkomst efter skatt',
                value: nettoInkomst,
                order: 8
            },
            'BB': {
                label: 'Barnbidrag',
                value: BB,
                type: 'skattefri',
                order: 9
            },
            'disponibelInkomst': {
                label: 'Disponibel inkomst',
                value: disponibelInkomst,
                order: 10
            }
        }
        /*angular.forEach(inkomstSpec, function(d, key) {
            if (d.type == 'netto') {
                inkomstSpec.totalNetto.value += d.value;
            }
            if (d.type == 'brutto') {
                inkomstSpec.totalBrutto.value += d.value;
            }
            if (d.type == 'skattefri') {
                inkomstSpec.totalNetto.value += d.value;
                inkomstSpec.totalBrutto.value += d.value;
            }
        });*/
        return inkomstSpec;

    }

    return service;

});
