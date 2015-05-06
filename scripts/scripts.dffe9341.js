"use strict";var app=angular.module("sacoForaldraforsakringApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.bootstrap","ui.bootstrap-slider","angular-toArrayFilter","n3-line-chart","angularytics"]).config(["AngularyticsProvider",function(a){a.setEventHandlers(["GoogleUniversal"])}]).run(["Angularytics",function(a){a.init()}]);d3.selection.prototype.last=function(){var a=this.size()-1;return a>=0?d3.select(this[0][a]):[]},d3.selection.prototype.first=function(){return d3.select(this[0][0])};var directive,m,mod,old_m,__indexOf=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};old_m=angular.module("n3-charts.linechart",["n3charts.utils"]),m=angular.module("n3-line-chart",["n3charts.utils"]),directive=function(a,b){return old_m.directive(a,b),m.directive(a,b)},directive("linechart",["n3utils","$window","$timeout",function(a,b,c){var d;return d=function(d,e,f,g){var h,i,j,k,l,m;return m=a,h=m.getDefaultMargins(),e[0].style["font-size"]=0,d.updateDimensions=function(a){var b,c,d,g,h;d=e[0].parentElement,h=m.getPixelCssProp(d,"padding-top"),b=m.getPixelCssProp(d,"padding-bottom"),c=m.getPixelCssProp(d,"padding-left"),g=m.getPixelCssProp(d,"padding-right"),a.width=+(f.width||d.offsetWidth||900)-c-g,a.height=+(f.height||d.offsetHeight||500)-h-b},d.redraw=function(){d.updateDimensions(h),d.update(h)},j=!1,i={onSeriesVisibilityChange:function(a){var b,c,e;return e=a.series,b=a.index,c=a.newVisibility,d.options.series[b].visible=c,d.$apply()}},d.updateWithoutRedraw=function(){var a=d3.select(e[0]).select("svg");m.annotateSelectedX(a,d.selected)},d.update=function(a){var b,c,g,h,j,k,l,n;return l=m.sanitizeOptions(d.options,f.mode),l.dimensions&&angular.extend(a,l.dimensions),j=angular.extend(i,m.getTooltipHandlers(l)),g=m.getDataPerSeries(d.data,l),k="thumbnail"===f.mode,m.clean(e[0]),n=m.bootstrap(e[0],a),h=function(a){return l.series.filter(function(b){return b.axis===a&&b.visible!==!1}).length>0},b=m.createAxes(n,a,l.axes).andAddThemIf({all:!k,x:!0,y:h("y"),y2:h("y2")}),g.length&&m.setScalesDomain(b,d.data,l.series,n,l),k?m.adjustMarginsForThumbnail(a,b):m.adjustMargins(a,l),m.createContent(n,j),g.length&&(c=m.getBestColumnWidth(a,g,l),m.drawArea(n,b,g,l,j).drawColumns(n,b,g,c,l,j).drawLines(n,b,g,l,j),l.drawDots&&m.drawDots(n,b,g,l,j)),l.drawLegend&&m.drawLegend(n,l.series,a,j),g.length&&(m.annotateMax(n),m.addClassToFirstAndLast(n),m.annotateSelectedX(n,d.selected)),"scrubber"===l.tooltip.mode?m.createGlass(n,a,j,b,g,l,c):"none"!==l.tooltip.mode?m.addTooltips(n,a,l.axes):void 0},k=void 0,l=function(){return null!=k&&c.cancel(k),k=c(d.redraw,1)},b.addEventListener("resize",l),d.$watch("data",d.redraw,!0),d.$on("redraw-chart",d.redraw),d.$watch("selected",d.updateWithoutRedraw),d.$watch("options",function(){return d.update(h)},!0)},{replace:!0,restrict:"E",scope:{data:"=",options:"=",selected:"=highlight"},template:"<div></div>",link:d}}]),mod=angular.module("n3charts.utils",[]),mod.factory("n3utils",["$window","$log","$rootScope",function(a,b,c){return{addPatterns:function(a,b){var c;return c=a.select("defs").selectAll("pattern").data(b.filter(function(a){return a.striped})).enter().append("pattern").attr({id:function(a){return a.type+"Pattern_"+a.index},patternUnits:"userSpaceOnUse",x:0,y:0,width:60,height:60}).append("g").style({fill:function(a){return a.color},"fill-opacity":.3}),c.append("rect").style("fill-opacity",.3).attr("width",60).attr("height",60),c.append("path").attr("d","M 10 0 l10 0 l -20 20 l 0 -10 z"),c.append("path").attr("d","M40 0 l10 0 l-50 50 l0 -10 z"),c.append("path").attr("d","M60 10 l0 10 l-40 40 l-10 0 z"),c.append("path").attr("d","M60 40 l0 10 l-10 10 l -10 0 z")},drawArea:function(a,b,c,d){var e,f;return e=c.filter(function(a){return"area"===a.type}),this.addPatterns(a,e),f={y:this.createLeftAreaDrawer(b,d.lineMode,d.tension),y2:this.createRightAreaDrawer(b,d.lineMode,d.tension)},a.select(".content").selectAll(".areaGroup").data(e).enter().append("g").attr("class",function(a){return"areaGroup series_"+a.index}).append("path").attr("class","area").style("fill",function(a){return a.striped!==!0?a.color:"url(#areaPattern_"+a.index+")"}).style("opacity",function(a){return a.striped?"1":"0.3"}).attr("d",function(a){return f[a.axis](a.values)}),this},createLeftAreaDrawer:function(a,b,c){return d3.svg.area().x(function(b){return a.xScale(b.x)}).y0(function(b){return a.yScale(b.y0)}).y1(function(b){return a.yScale(b.y0+b.y)}).interpolate(b).tension(c)},createRightAreaDrawer:function(a,b,c){return d3.svg.area().x(function(b){return a.xScale(b.x)}).y0(function(b){return a.y2Scale(b.y0)}).y1(function(b){return a.y2Scale(b.y0+b.y)}).interpolate(b).tension(c)},getPseudoColumns:function(a,b){var c,d;return a=a.filter(function(a){return"column"===a.type}),d={},c=[],a.forEach(function(a){var e,f,g;return f=!1,b.stacks.forEach(function(b,e){var g;return null!=a.id&&(g=a.id,__indexOf.call(b.series,g)>=0)?(d[a.id]=e,__indexOf.call(c,e)<0&&c.push(e),f=!0):void 0}),f===!1?(e=d[a.id]=g=c.length,c.push(e)):void 0}),{pseudoColumns:d,keys:c}},getBestColumnWidth:function(a,b,c){var d,e,f,g,h,i;return b&&0!==b.length?0===b.filter(function(a){return"column"===a.type}).length?10:(i=this.getPseudoColumns(b,c),g=i.pseudoColumns,e=i.keys,f=b[0].values.length+2,h=e.length,d=a.width-a.left-a.right,parseInt(Math.max((d-(f-1)*c.columnsHGap)/(f*h),5))):10},getColumnAxis:function(a,b,c){var d,e,f,g;return g=this.getPseudoColumns(a,c),e=g.pseudoColumns,d=g.keys,f=d3.scale.ordinal().domain(d).rangeBands([0,d.length*b],0),function(a){var c;return null==e[a.id]?0:(c=e[a.id],f(c)-d.length*b/2)}},drawColumns:function(a,b,c,d,e,f){var g,h;return c=c.filter(function(a){return"column"===a.type}),h=this.getColumnAxis(c,d,e),c.forEach(function(a){return a.xOffset=h(a)+.5*d}),g=a.select(".content").selectAll(".columnGroup").data(c).enter().append("g").attr("class",function(a){return"columnGroup series_"+a.index}).style("stroke",function(a){return a.color}).style("fill",function(a){return a.color}).style("fill-opacity",.8).attr("transform",function(a){return"translate("+h(a)+",0)"}).on("mouseover",function(c){var d;return d=d3.select(d3.event.target),"function"==typeof f.onMouseOver?f.onMouseOver(a,{series:c,x:d.attr("x"),y:b[c.axis+"Scale"](d.datum().y0+d.datum().y),datum:d.datum()}):void 0}).on("mouseout",function(b){return d3.select(d3.event.target).attr("r",2),"function"==typeof f.onMouseOut?f.onMouseOut(a):void 0}),g.selectAll("rect").data(function(a){return a.values}).enter().append("rect").style({"stroke-opacity":function(a){return 0===a.y?"0":"1"},"stroke-width":"1px","fill-opacity":function(a){return 0===a.y?0:.7}}).attr({width:d,x:function(a){return b.xScale(a.x)},height:function(a){return 0===a.y?b[a.axis+"Scale"].range()[0]:Math.abs(b[a.axis+"Scale"](a.y0+a.y)-b[a.axis+"Scale"](a.y0))},y:function(a){return 0===a.y?0:b[a.axis+"Scale"](Math.max(0,a.y0+a.y))}}),this},drawDots:function(a,b,c,d,e){var f;f=a.select(".content").selectAll(".dotGroup").data(c.filter(function(a){var b;return("line"===(b=a.type)||"area"===b)&&a.drawDots})).enter().append("g");var g=f.attr({"class":function(a){return"dotGroup series_"+a.index},fill:function(a){return a.color}}).selectAll(".dot").data(function(a){return a.values}).enter().append("g").attr("class","dot-group").attr("transform",function(a){return"translate("+[b.xScale(a.x),b[a.axis+"Scale"](a.y+a.y0)]+")"});return g.append("circle").attr({"class":"dot",r:function(a){return a.dotSize},cx:function(a){return 0},cy:function(a){return 0}}).style({stroke:"white","stroke-width":"2px"}),g.append("text").attr({"class":"max-annotation","font-size":"11px","text-anchor":"middle",dy:0,y:-7}).text(function(a){return"Ert max"}),g.append("line").attr({"class":"selected-annotation line",x1:0,x2:0,y1:0,y2:function(a){return b[a.axis+"Scale"](0)-b[a.axis+"Scale"](a.y+a.y0)}}),"none"!==d.tooltip.mode&&f.on("mouseover",function(b){var c;return c=d3.select(d3.event.target),c.attr("r",function(a){return a.dotSize+2}),"function"==typeof e.onMouseOver?e.onMouseOver(a,{series:b,x:c.attr("cx"),y:c.attr("cy"),datum:c.datum()}):void 0}).on("mouseout",function(b){return d3.select(d3.event.target).attr("r",function(a){return a.dotSize}),"function"==typeof e.onMouseOut?e.onMouseOut(a):void 0}),this},computeLegendLayout:function(a,b,c){var d,e,f,g,h,i,j,k,l,m;for(i=10,l=this,h=this.getLegendItemsWidths(a,"y"),g=[0],e=1;e<h.length;)g.push(h[e-1]+g[e-1]+i),e++;if(k=this.getLegendItemsWidths(a,"y2"),!(k.length>0))return[g];for(m=c.width-c.right-c.left,d=0,j=[],f=k.length-1;f>=0;)j.push(m-d-k[f]),d+=k[f]+i,f--;return j.reverse(),[g,j]},getLegendItemsWidths:function(a,b){var c,d,e,f,g;if(f=this,c=function(a){return f.getTextBBox(a).width},e=a.selectAll(".legendItem."+b),!(e.length>0))return[];for(g=[],d=0;d<e[0].length;)g.push(c(e[0][d])),d++;return g},drawLegend:function(a,b,c,d){var e,f,g,h,i,j,k,l;return k=this,i=a.append("g").attr("class","legend"),e=8,a.select("defs").append("svg:clipPath").attr("id","legend-clip").append("circle").attr("r",e/2),f=i.selectAll(".legendItem").data(b),g=f.enter().append("g").attr({"class":function(a,b){return"legendItem series_"+b+" "+a.axis},opacity:function(b,c){return b.visible===!1?(k.toggleSeries(a,c),"0.2"):"1"}}),f.append("circle").attr({fill:function(a){return a.color},stroke:function(a){return a.color},"stroke-width":"2px",r:e/2}),f.append("path").attr({"clip-path":"url(#legend-clip)","fill-opacity":function(a){var b;return"area"===(b=a.type)||"column"===b?"1":"0"},fill:"white",stroke:"white","stroke-width":"2px",d:function(a){return k.getLegendItemPath(a,e,e)}}),f.append("circle").attr({"fill-opacity":0,stroke:function(a){return a.color},"stroke-width":"2px",r:e/2}),f.append("text").attr({"class":function(a,b){return"legendText series_"+b},"font-family":"Courier","font-size":10,transform:"translate(13, 4)","text-rendering":"geometric-precision"}).text(function(a){return a.label||a.y}),l=this.computeLegendLayout(a,b,c),h=l[0],j=l[1],g.attr({transform:function(a,b){return"y"===a.axis?"translate("+h.shift()+","+(c.height-40)+")":"translate("+j.shift()+","+(c.height-40)+")"}}),this},getLegendItemPath:function(a,b,c){var d,e;return"column"===a.type?(e="M"+-b/3+" "+-c/8+" l0 "+c+" ",e+="M0 "+-c/3+" l0 "+c+" ",e+="M"+b/3+" "+-c/10+" l0 "+c+" "):(d="M-"+b/2+" 0"+c/3+" l"+b/3+" -"+c/3+" l"+b/3+" "+c/3+" l"+b/3+" -"+2*c/3,"area"===a.type,d)},toggleSeries:function(a,b){var c;return c=!1,a.select(".content").selectAll(".series_"+b).style("display",function(a){return"none"===d3.select(this).style("display")?(c=!0,"initial"):(c=!1,"none")}),c},drawLines:function(a,b,c,d,e){var f,g,h;return f={y:this.createLeftLineDrawer(b,d.lineMode,d.tension),y2:this.createRightLineDrawer(b,d.lineMode,d.tension)},h=a.select(".content").selectAll(".lineGroup").data(c.filter(function(a){var b;return"line"===(b=a.type)||"area"===b})).enter().append("g"),h.style("stroke",function(a){return a.color}).attr("class",function(a){return"lineGroup series_"+a.index}).append("path").attr({"class":"line",d:function(a){return f[a.axis](a.values)}}).style({fill:"none","stroke-width":function(a){return a.thickness},"stroke-dasharray":function(a){return"dashed"===a.lineMode?"10,3":void 0}}),d.tooltip.interpolate&&(g=function(c){var d,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A;r=d3.select(d3.event.target);try{q=d3.mouse(this)}catch(B){f=B,q=[0,0]}for(s=r.datum().values,g=z=0,A=s.length;A>z;g=++z)d=s[g],t=b.xScale(d.x),w=b.yScale(d.y),("undefined"==typeof m||null===m||m>t)&&(m=t,n=d.x),("undefined"==typeof i||null===i||t>i)&&(i=t,j=d.x),("undefined"==typeof o||null===o||o>w)&&(o=w),("undefined"==typeof k||null===k||w>k)&&(k=w),("undefined"==typeof p||null===p||d.y<p)&&(p=d.y),("undefined"==typeof l||null===l||d.y>l)&&(l=d.y);return u=(q[0]-m)/(i-m),x=(q[1]-o)/(k-o),v=Math.round(u*(j-n)+n),y=Math.round((1-x)*(l-p)+p),h={x:v,y:y},"function"==typeof e.onMouseOver?e.onMouseOver(a,{series:c,x:q[0],y:q[1],datum:h}):void 0},h.on("mousemove",g).on("mouseout",function(b){return"function"==typeof e.onMouseOut?e.onMouseOut(a):void 0})),this},createLeftLineDrawer:function(a,b,c){return d3.svg.line().x(function(b){return a.xScale(b.x)}).y(function(b){return a.yScale(b.y+b.y0)}).interpolate(b).tension(c)},createRightLineDrawer:function(a,b,c){return d3.svg.line().x(function(b){return a.xScale(b.x)}).y(function(b){return a.y2Scale(b.y+b.y0)}).interpolate(b).tension(c)},getPixelCssProp:function(b,c){var d;return d=a.getComputedStyle(b,null).getPropertyValue(c),+d.replace(/px$/,"")},getDefaultMargins:function(){return{top:20,right:10,bottom:60,left:50}},clean:function(a){return d3.select(a).on("keydown",null).on("keyup",null).select("svg").remove()},bootstrap:function(a,b){var c,d,e;return d3.select(a).classed("chart",!0),e=b.width,c=b.height,d=d3.select(a).append("svg").attr({width:e,height:c}).append("g").attr("transform","translate("+b.left+","+b.top+")"),d.append("defs").attr("class","patterns"),d},createContent:function(a){return a.append("g").attr("class","content")},createGlass:function(a,b,c,d,e,f,g){var h,i,j,k;return j=a.append("g").attr({"class":"glass-container",opacity:0}),k=j.selectAll(".scrubberItem").data(e).enter().append("g").attr("class",function(a,b){return"scrubberItem series_"+b}),h=k.append("g").attr({"class":function(a,b){return"rightTT"}}),h.append("path").attr({"class":function(a,b){return"scrubberPath series_"+b},y:"-7px",fill:function(a){return a.color}}),this.styleTooltip(h.append("text").style("text-anchor","start").attr({"class":function(a,b){return"scrubberText series_"+b},height:"14px",transform:"translate(7, 3)","text-rendering":"geometric-precision"})).text(function(a){return a.label||a.y}),i=k.append("g").attr({"class":function(a,b){return"leftTT"}}),i.append("path").attr({"class":function(a,b){return"scrubberPath series_"+b},y:"-7px",fill:function(a){return a.color}}),this.styleTooltip(i.append("text").style("text-anchor","end").attr({"class":function(a,b){return"scrubberText series_"+b},height:"14px",transform:"translate(-13, 3)","text-rendering":"geometric-precision"})).text(function(a){return a.label||a.y}),k.append("circle").attr({"class":function(a,b){return"scrubberDot series_"+b},fill:"white",stroke:function(a){return a.color},"stroke-width":"2px",r:4}),j.append("rect").attr({"class":"glass",width:b.width-b.left-b.right,height:b.height-b.top-b.bottom}).style("fill","white").style("fill-opacity",1e-6).on("mouseover",function(){return c.onChartHover(a,d3.select(d3.event.target),d,e,f,g)})},getDataPerSeries:function(a,b){var c,d,e,f;return e=b.series,c=b.axes,e&&e.length&&a&&a.length?(f=e.map(function(c,d){var e;e={index:d,name:c.y,values:[],color:c.color,axis:c.axis||"y",xOffset:0,type:c.type,thickness:c.thickness,drawDots:c.drawDots!==!1},null!=c.dotSize&&(e.dotSize=c.dotSize),c.striped===!0&&(e.striped=!0),null!=c.lineMode&&(e.lineMode=c.lineMode),c.id&&(e.id=c.id);var f=b.stacks.filter(function(a){return a.series.indexOf(c.id)>-1});return a.filter(function(a){return null!=a[c.y]}).forEach(function(a){var d;return d={x:a[b.axes.x.key],y:a[c.y],y0:0,stackTotal:0,axis:c.axis||"y"},null!=c.dotSize&&(d.dotSize=c.dotSize),f.length>0&&f[0].series.forEach(function(b){d.stackTotal+=a[b]}),e.values.push(d)}),e}),null==b.stacks||0===b.stacks.length?f:(d=d3.layout.stack().values(function(a){return a.values}),b.stacks.forEach(function(a){var b;if(a.series.length>0)return b=f.filter(function(b,c){var d;return null!=b.id&&(d=b.id,__indexOf.call(a.series,d)>=0)}),d(b)}),f)):[]},resetMargins:function(a){var b;return b=this.getDefaultMargins(),a.left=b.left,a.right=b.right,a.top=b.top,a.bottom=b.bottom},adjustMargins:function(a,b){var c,d,e;this.resetMargins(a),null!=b.axes&&(e=b.axes,c=e.y,d=e.y2,null!=(null!=c?c.width:void 0)&&(a.left=null!=c?c.width:void 0),null!=(null!=d?d.width:void 0)&&(a.right=null!=d?d.width:void 0))},adjustMarginsForThumbnail:function(a,b){return a.top=1,a.bottom=2,a.left=0,a.right=1},estimateSideTooltipWidth:function(a,b){var c,d;return d=a.append("text"),d.text(""+b),this.styleTooltip(d),c=this.getTextBBox(d[0][0]),d.remove(),c},getTextBBox:function(a){return a.getBBox()},getWidestTickWidth:function(a,b){var c,d,e,f;return d=0,c=this.getTextBBox,e=a.select("."+b+".axis").selectAll(".tick"),null!=(f=e[0])&&f.forEach(function(a){return d=Math.max(d,c(a).width)}),d},getWidestOrdinate:function(a,b,c){var d;return d="",a.forEach(function(a){return b.forEach(function(b){var e,f;return e=a[b.y],null!=b.axis&&(null!=(f=c.axes[b.axis])?f.labelFunction:void 0)&&(e=c.axes[b.axis].labelFunction(e)),null!=e&&(""+e).length>(""+d).length?d=e:void 0})}),d},getDefaultOptions:function(){return{tooltip:{mode:"scrubber"},lineMode:"linear",tension:.7,axes:{x:{type:"linear",key:"x"},y:{type:"linear"}},series:[],drawLegend:!0,drawDots:!0,stacks:[],columnsHGap:5}},sanitizeOptions:function(a,b){return null==a?this.getDefaultOptions():("thumbnail"===b&&(a.drawLegend=!1,a.drawDots=!1,a.tooltip={mode:"none",interpolate:!1}),a.series=this.sanitizeSeriesOptions(a.series),a.stacks=this.sanitizeSeriesStacks(a.stacks,a.series),a.axes=this.sanitizeAxes(a.axes,this.haveSecondYAxis(a.series)),a.lineMode||(a.lineMode="linear"),a.tension=/^\d+(\.\d+)?$/.test(a.tension)?a.tension:.7,this.sanitizeTooltip(a),a.drawLegend=a.drawLegend!==!1,a.drawDots=a.drawDots!==!1,angular.isNumber(a.columnsHGap)||(a.columnsHGap=5),a)},sanitizeSeriesStacks:function(a,c){var d;return null==a?[]:(d={},c.forEach(function(a){return d[a.id]=a}),a.forEach(function(a){return a.series.forEach(function(c){var e;if(e=d[c],null!=e){if(e.axis!==a.axis)return b.warn("Series "+c+" is not on the same axis as its stack")}else if(!e)return b.warn("Unknown series found in stack : "+c)})}),a)},sanitizeTooltip:function(a){var b;if(!a.tooltip)return void(a.tooltip={mode:"scrubber"});if("none"!==(b=a.tooltip.mode)&&"axes"!==b&&"scrubber"!==b&&(a.tooltip.mode="scrubber"),"scrubber"===a.tooltip.mode?delete a.tooltip.interpolate:a.tooltip.interpolate=!!a.tooltip.interpolate,"scrubber"===a.tooltip.mode&&a.tooltip.interpolate)throw new Error("Interpolation is not supported for scrubber tooltip mode.")},sanitizeSeriesOptions:function(a){var b,c;return null==a?[]:(b=d3.scale.category10(),c={},a.forEach(function(a,b){if(null!=c[a.id])throw new Error("Twice the same ID ("+a.id+") ? Really ?");return null!=a.id?c[a.id]=a:void 0}),a.forEach(function(a,d){var e,f,g,h,i;if(a.axis="y2"!==(null!=(f=a.axis)?f.toLowerCase():void 0)?"y":"y2",a.color||(a.color=b(d)),a.type="line"===(g=a.type)||"area"===g||"column"===g?a.type:"line","column"===a.type?(delete a.thickness,delete a.lineMode,delete a.drawDots,delete a.dotSize):/^\d+px$/.test(a.thickness)||(a.thickness="1px"),("line"===(h=a.type)||"area"===h)&&("dashed"!==(i=a.lineMode)&&delete a.lineMode,a.drawDots!==!1&&null==a.dotSize&&(a.dotSize=2)),null==a.id){for(e=0;null!=c["series_"+e];)e++;a.id="series_"+e,c[a.id]=a}return a.drawDots===!1?delete a.dotSize:void 0}),a)},sanitizeAxes:function(a,b){var c;return null==a&&(a={}),a.x=this.sanitizeAxisOptions(a.x),(c=a.x).key||(c.key="x"),a.y=this.sanitizeAxisOptions(a.y),b&&(a.y2=this.sanitizeAxisOptions(a.y2)),a},sanitizeExtrema:function(a){var b,c;return c=this.getSanitizedNumber(a.min),null!=c?a.min=c:delete a.min,b=this.getSanitizedNumber(a.max),null!=b?a.max=b:delete a.max},getSanitizedNumber:function(a){var c;return null==a?void 0:(c=parseInt(a,10),isNaN(c)?void b.warn("Invalid extremum value : "+a+", deleting it."):c)},sanitizeAxisOptions:function(a){return null==a?{type:"linear"}:(a.type||(a.type="linear"),this.sanitizeExtrema(a),a)},createAxes:function(a,b,c){var d,e,f,g,h,i,j,k,l,m;return d=null!=c.y2,g=b.width,e=b.height,g=g-b.left-b.right,e=e-b.top-b.bottom,h=void 0,h="date"===c.x.type?d3.time.scale().rangeRound([0,g]):d3.scale.linear().rangeRound([0,g]),i=this.createAxis(h,"x",c),j=void 0,j="log"===c.y.type?d3.scale.log().clamp(!0).rangeRound([e,0]):d3.scale.linear().rangeRound([e,0]),j.clamp(!0),m=this.createAxis(j,"y",c),k=void 0,k=d&&"log"===c.y2.type?d3.scale.log().clamp(!0).rangeRound([e,0]):d3.scale.linear().rangeRound([e,0]),k.clamp(!0),l=this.createAxis(k,"y2",c),f=function(a){return a.style({font:"10px Courier","shape-rendering":"crispEdges"}),a.selectAll("path").style({fill:"none",stroke:"#000"})},{xScale:h,yScale:j,y2Scale:k,xAxis:i,yAxis:m,y2Axis:l,andAddThemIf:function(b){return b.all&&(b.x&&f(a.append("g").attr("class","x axis").attr("transform","translate(0,"+e+")").call(i)),b.y&&f(a.append("g").attr("class","y axis").call(m)),d&&b.y2&&f(a.append("g").attr("class","y2 axis").attr("transform","translate("+g+", 0)").call(l))),{xScale:h,yScale:j,y2Scale:k,xAxis:i,yAxis:m,y2Axis:l}}}},createAxis:function(a,b,c){var d,e,f;return f={x:"bottom",y:"left",y2:"right"},e=c[b],d=d3.svg.axis().scale(a).orient(f[b]).tickFormat(null!=e?e.labelFunction:void 0),null==e?d:(angular.isNumber(e.ticks)&&d.ticks(e.ticks),angular.isArray(e.ticks)&&d.tickValues(e.ticks),d)},setScalesDomain:function(a,b,c,d,e){var f,g;return this.setXScale(a.xScale,b,c,e.axes),d.selectAll(".x.axis").call(a.xAxis),c.filter(function(a){return"y"===a.axis&&a.visible!==!1}).length>0&&(g=this.getVerticalDomain(e,b,c,"y"),a.yScale.domain(g).nice(),d.selectAll(".y.axis").call(a.yAxis)),c.filter(function(a){return"y2"===a.axis&&a.visible!==!1}).length>0?(f=this.getVerticalDomain(e,b,c,"y2"),a.y2Scale.domain(f).nice(),d.selectAll(".y2.axis").call(a.y2Axis)):void 0},getVerticalDomain:function(a,b,c,d){var e,f,g;return(g=a.axes[d])?null!=g.ticks&&angular.isArray(g.ticks)?[g.ticks[0],g.ticks[g.ticks.length-1]]:(f=c.filter(function(a){return a.axis===d&&a.visible!==!1}),e=this.yExtent(c.filter(function(a){return a.axis===d&&a.visible!==!1}),b,a.stacks.filter(function(a){return a.axis===d})),"log"===g.type&&(e[0]=0===e[0]?.001:e[0]),null!=g.min&&(e[0]=g.min),null!=g.max&&(e[1]=g.max),e):[]},yExtent:function(a,b,c){var d,e,f;return f=Number.POSITIVE_INFINITY,e=Number.NEGATIVE_INFINITY,d=[],c.forEach(function(b){return d.push(b.series.map(function(b){return a.filter(function(a){return a.id===b})[0]}))}),a.forEach(function(a,b){var e;return e=!1,c.forEach(function(b){var c;return c=a.id,__indexOf.call(b.series,c)>=0?e=!0:void 0}),e?void 0:d.push([a])}),d.forEach(function(a){return f=Math.min(f,d3.min(b,function(b){return a.reduce(function(a,c){return Math.min(a,b[c.y])},Number.POSITIVE_INFINITY)})),e=Math.max(e,d3.max(b,function(b){return a.reduce(function(a,c){return a+b[c.y]},0)}))}),f===e?f>0?[0,2*f]:[2*f,0]:[f,e]},setXScale:function(a,b,c,d){var e,f;return e=this.xExtent(b,d.x.key),c.filter(function(a){return"column"===a.type}).length&&this.adjustXDomainForColumns(e,b,d.x.key),f=d.x,null!=f.min&&(e[0]=f.min),null!=f.max&&(e[1]=f.max),a.domain(e)},xExtent:function(a,b){var c,d,e;return e=d3.extent(a,function(a){return a[b]}),c=e[0],d=e[1],c===d?c>0?[0,2*c]:[2*c,0]:[c,d]},adjustXDomainForColumns:function(a,b,c){var d;return d=this.getAverageStep(b,c),angular.isDate(a[0])?(a[0]=new Date(a[0].getTime()-d),a[1]=new Date(a[1].getTime()+d)):(a[0]=a[0]-d,a[1]=a[1]+d)},getAverageStep:function(a,b){var c,d,e;if(!(a.length>1))return 0;for(e=0,d=a.length-1,c=0;d>c;)e+=a[c+1][b]-a[c][b],c++;return e/d},haveSecondYAxis:function(a){return!a.every(function(a){return"y2"!==a.axis})},showScrubber:function(a,b,c,d,e,f){var g;return g=this,b.on("mousemove",function(){return a.selectAll(".glass-container").attr("opacity",1),g.updateScrubber(a,d3.mouse(this),c,d,e,f)}),b.on("mouseout",function(){return b.on("mousemove",null),a.selectAll(".glass-container").attr("opacity",0)})},getClosestPoint:function(a,b){var c,d,e;for(d=0,e=a.length-1,c=Math.round((e-d)/2);;)if(b<a[c].x?(e=c,c-=Math.ceil((e-d)/2)):(d=c,c+=Math.floor((e-d)/2)),c===d||c===e){c=Math.abs(b-a[d].x)<Math.abs(b-a[e].x)?d:e;break}return a[c]},updateScrubber:function(a,b,c,d,e,f){var g,h,i,j,k,l;return k=b[0],l=b[1],g=function(a){return a.transition().duration(50)},i=this,h=[],d.forEach(function(b,d){var f,j,l,m,n,o,p,q,r;return f=a.select(".scrubberItem.series_"+d),e.series[d].visible===!1?void f.attr("opacity",0):(f.attr("opacity",1),r=i.getClosestPoint(b.values,c.xScale.invert(k)),q=r.x+" : "+r.y,e.tooltip.formatter&&(q=e.tooltip.formatter(r.x,r.y,r.stackTotal,e.series[d])),n=f.select(".rightTT"),m=n.select("text"),m.text(q),l=f.select(".leftTT"),j=l.select("text"),j.text(q),p={right:i.getTextBBox(m[0][0]).width+5,left:i.getTextBBox(j[0][0]).width+5},o="y2"===b.axis?"right":"left",k=c.xScale(r.x),"left"===o?k+i.getTextBBox(j[0][0]).x-10<0&&(o="right"):"right"===o&&k+p.right>i.getTextBBox(a.select(".glass")[0][0]).width&&(o="left"),"left"===o?(g(n).attr("opacity",0),g(l).attr("opacity",1)):(g(n).attr("opacity",1),g(l).attr("opacity",0)),h[d]={index:d,x:k,y:c[r.axis+"Scale"](r.y+r.y0),side:o,sizes:p})}),h=this.preventOverlapping(h),j=Math.max(15,100/f),d.forEach(function(b,c){var d,f,k,l;if(e.series[c].visible!==!1)return f=h[c],d=a.select(".scrubberItem.series_"+c),k=d.select("."+f.side+"TT"),l="left"===f.side?b.xOffset:-b.xOffset,k.select("text").attr("transform",function(){return"left"===f.side?"translate("+(-3-j-l)+", "+(f.labelOffset+3)+")":"translate("+(4+j+l)+", "+(f.labelOffset+3)+")"}),k.select("path").attr("d",i.getScrubberPath(f.sizes[f.side]+1,f.labelOffset,f.side,j+l)),g(d).attr({transform:"translate("+(h[c].x+b.xOffset)+", "+h[c].y+")"})})},getScrubberPath:function(a,b,c,d){var e,f,g,h;return e=18,f=d,a=a,g="left"===c?1:-1,h=1,0!==b&&(h=Math.abs(b)/b),b||(b=0),["m0 0","l"+g+" 0","l0 "+(b+h),"l"+-g*(f+1)+" 0","l0 "+(-e/2-h),"l"+-g*a+" 0","l0 "+e,"l"+g*a+" 0","l0 "+(-e/2-h),"l"+g*(f-1)+" 0","l0 "+(-b+h),"l1 0","z"].join("")},preventOverlapping:function(a){var b,c,d,e;return d=18,b={},a.forEach(function(a){var c;return b[c=a.x]||(b[c]={left:[],right:[]}),b[a.x][a.side].push(a)}),c=function(a){var c,e,f,g,h,i,j,k,l;f=[];for(j in b)if(i=b[j],0!==i[a].length){for(g={};i[a].length>0;){h=i[a].pop(),c=!1;for(k in g)e=g[k],+k-d<=(l=h.y)&&+k+d>=l&&(e.push(h),c=!0);c||(g[h.y]=[h])}f.push(g)}return f},e=function(a){var b,c,d,e,f,g,h;f=20;for(b in a){g=a[b];for(h in g)d=g[h],c=d.length,1!==c?(d=d.sort(function(a,b){return a.y-b.y}),e=c%2===0?-(f/2)*(c/2):-(c-1)/2*f,d.forEach(function(a,b){return a.labelOffset=e+f*b})):d[0].labelOffset=0}},e(c("left")),e(c("right")),a},getTooltipHandlers:function(a){return"scrubber"===a.tooltip.mode?{onChartHover:angular.bind(this,this.showScrubber)}:{onMouseOver:angular.bind(this,this.onMouseOver),onMouseOut:angular.bind(this,this.onMouseOut)}},styleTooltip:function(a){return a.attr({"font-family":"monospace","font-size":10,fill:"white","text-rendering":"geometric-precision"})},addTooltips:function(a,b,c){var d,e,f,g,h,i,j,k;return h=b.width,e=b.height,h=h-b.left-b.right,e=e-b.top-b.bottom,g=24,d=18,f=5,i=a.append("g").attr({id:"xTooltip","class":"xTooltip",opacity:0}),i.append("path").attr("transform","translate(0,"+(e+1)+")"),this.styleTooltip(i.append("text").style("text-anchor","middle").attr({width:g,height:d,transform:"translate(0,"+(e+19)+")"})),k=a.append("g").attr({id:"yTooltip","class":"yTooltip",opacity:0}),k.append("path"),this.styleTooltip(k.append("text").attr({width:d,height:g})),null!=c.y2?(j=a.append("g").attr({id:"y2Tooltip","class":"y2Tooltip",opacity:0,transform:"translate("+h+",0)"}),j.append("path"),this.styleTooltip(j.append("text").attr({width:d,height:g}))):void 0},onMouseOver:function(a,b){return this.updateXTooltip(a,b),"y2"===b.series.axis?this.updateY2Tooltip(a,b):this.updateYTooltip(a,b)},onMouseOut:function(a){return this.hideTooltips(a)},updateXTooltip:function(a,b){var c,d,e,f,g,h;return g=b.x,c=b.datum,e=b.series,h=a.select("#xTooltip"),h.transition().attr({opacity:1,transform:"translate("+g+",0)"}),f=c.x,d=h.select("text"),d.text(f),h.select("path").attr("fill",e.color).attr("d",this.getXTooltipPath(d[0][0]))},getXTooltipPath:function(a){var b,c,d;return d=Math.max(this.getTextBBox(a).width,15),b=18,c=5,"m-"+d/2+" "+c+" l0 "+b+" l"+d+" 0 l0 "+-b+"l"+(-d/2+c)+" 0 l"+-c+" -"+b/4+" l"+-c+" "+b/4+" l"+(-d/2+c)+" 0z"},updateYTooltip:function(a,b){var c,d,e,f,g,h;return g=b.y,c=b.datum,e=b.series,h=a.select("#yTooltip"),h.transition().attr({opacity:1,transform:"translate(0, "+g+")"}),d=h.select("text"),d.text(c.y),f=this.getTextBBox(d[0][0]).width+5,d.attr({transform:"translate("+(-f-2)+",3)",width:f}),h.select("path").attr("fill",e.color).attr("d",this.getYTooltipPath(f))},updateY2Tooltip:function(a,b){var c,d,e,f,g,h;return g=b.y,c=b.datum,e=b.series,h=a.select("#y2Tooltip"),h.transition().attr("opacity",1),d=h.select("text"),d.text(c.y),f=this.getTextBBox(d[0][0]).width+5,d.attr({transform:"translate(7, "+(parseFloat(g)+3)+")",w:f}),h.select("path").attr({fill:e.color,d:this.getY2TooltipPath(f),transform:"translate(0, "+g+")"})},getYTooltipPath:function(a){var b,c;return b=18,c=5,"m0 0l"+-c+" "+-c+" l0 "+(-b/2+c)+" l"+-a+" 0 l0 "+b+" l"+a+" 0 l0 "+(-b/2+c)+"l"+-c+" "+c+"z"},getY2TooltipPath:function(a){var b,c;return b=18,c=5,"m0 0l"+c+" "+c+" l0 "+(b/2-c)+" l"+a+" 0 l0 "+-b+" l"+-a+" 0 l0 "+(b/2-c)+" l"+-c+" "+c+"z"},hideTooltips:function(a){return a.select("#xTooltip").transition().attr("opacity",0),a.select("#yTooltip").transition().attr("opacity",0),a.select("#y2Tooltip").transition().attr("opacity",0)},annotateMax:function(a){var b=0;a.selectAll(".dotGroup").last().selectAll(".dot-group").classed("max",!1).filter(function(a){var c=a.stackTotal>0?a.stackTotal:a.y,d=c>b;return d&&(b=c),d}).last().classed("max",!0)},annotateSelectedX:function(a,b){a.selectAll(".dot-group").classed("selected",!1).filter(function(a){return a.x==b}).classed("selected",!0)},addClassToFirstAndLast:function(a){a.selectAll(".dotGroup").last().selectAll(".dot-group").last().classed("last",!0),a.selectAll(".dotGroup").last().selectAll(".dot-group").first().classed("first",!0)}}}]),angular.module("sacoForaldraforsakringApp").controller("MainCtrl",["$scope","$modal","$filter","$timeout","$location","$anchorScroll","calculator","chart","pym","Angularytics",function(a,b,c,d,e,f,g,h,i,j){function k(){if(a.forms.userInput.$valid){var b=a.parents[0].input.ledigaManader,c=a.data.filter(function(a){return a.m0==b})[0];a.parents[0].inkomstSpec=c.inkomstSpec0,a.parents[1].inkomstSpec=c.inkomstSpec1}}function l(){a.chartOptions.axes.y.min=d3.min(a.data.map(function(a){return.9*a.disponibelInkomst}))}function m(){if(a.forms.userInput.$valid){var b=a.parents[0].input.lonManad,c=a.parents[1].input.lonManad,d=a.parents[0].input.foraldralonManader,e=a.parents[1].input.foraldralonManader;a.data=[],a.max.disponibelInkomst=0;for(var f=a.monthsMin;f<=a.monthsMax;f+=a.monthInterval){var h=f,i=12-f,m=g.inkomstSpec(b,h,d),n=g.inkomstSpec(c,i,e),o=m.disponibelInkomst.value+n.disponibelInkomst.value,p=m.FLnetto.value+n.FLnetto.value;a.data.push({m0:h,m1:i,inkomstSpec0:m,inkomstSpec1:n,x:f,disponibelInkomst:o-p,FLnetto:p,sum:o}),o>a.max.disponibelInkomst&&(a.max={ledigaManader:[h,i],disponibelInkomst:o})}k(),l(),j.trackEvent("Query","Wage parent 1",b),j.trackEvent("Query","Wage parent 2",c),j.trackEvent("Query","FL months parent 1",d),j.trackEvent("Query","FL months parent 2",e),j.trackEvent("Query","Leave months parent 1",h),j.trackEvent("Query","Leave months parent 2",i)}}e.hash("_"),a.monthsMin=1,a.monthsMax=11,a.monthInterval=1;c("currency");a.forms={userInput:{}},a.parents=[{input:{lonManad:null,ledigaManader:6,foraldralonManader:6}},{input:{lonManad:null,foraldralonManader:6}}],a.max={ledigaManader:[],disponibelInkomst:0},a.showResults=!1,a.invalidForm=!1,a.validate=function(){a.forms.userInput.$invalid?(a.showResults=!1,a.invalidForm=!0,a.forms.userInput.w0.$dirty=!0,a.forms.userInput.w1.$dirty=!0):(a.showResults=!0,a.invalidForm=!1,a.scrollToAnchor("result-card"),d(function(){a.$broadcast("redraw-chart")}))},a.$watch("parents[0].input.ledigaManader",function(b,c){a.parents[1].input.ledigaManader=12-b}),a.$watchGroup(["parents[0].input.lonManad","parents[1].input.lonManad","parents[0].input.foraldralonManader","parents[1].input.foraldralonManader"],m),a.$watchGroup(["parents[0].input.ledigaManader","parents[1].input.ledigaManader"],k),
a.settings={hetero:!0},a.$watch("settings.hetero",function(b){b?(a.parents[0].icon="images/woman.png",a.parents[0].label="mamman",a.parents[1].icon="images/man.png",a.parents[1].label="pappan"):(a.parents[0].icon="images/trans.png",a.parents[0].label="förälder ett",a.parents[1].icon="images/trans.png",a.parents[1].label="förälder två")}),a.modal=function(a,c){{var c=c||{};b.open({templateUrl:a,controller:"ModalInstanceCtrl",size:c.size||"sm",resolve:{params:function(){return c}}})}},a.sendHeight=function(){i.sendHeight()},a.scrollToAnchor=function(a){d(function(){e.hash(a),f(),i.sendHeight()},150)},a.chartOptions=h.options,a.data=[]}]),app.controller("ModalInstanceCtrl",["$scope","$modalInstance","params",function(a,b,c){a.params=c,a.close=function(){b.close()}}]),app.directive("incomeSpec",["$document",function(a){return{restrict:"E",transclude:!1,scope:{parents:"=",mode:"@"},templateUrl:"templates/income-spec.html",link:function(a,b,c){a.rows=["lonBrutto","FP","FL","JB","BB","disponibelInkomst"]}}}]),app.directive("ngOnHeightChange",function(){return{restrict:"A",scope:{callback:"=ngOnHeightChange"},link:function(a,b,c){a.$watch(function(){return b.height()},function(b){a.callback()})}}}),app.directive("monthSlider",function(){return{restrict:"E",transclude:!1,controller:["$scope",function(a){a.tooltipLabel=function(a){return a+" månader"},a.showTooltip="hide"}],templateUrl:"templates/slider.html"}}),app.filter("capitalize",function(){return function(a,b){return null!=a&&(a=a.toLowerCase()),a.substring(0,1).toUpperCase()+a.substring(1)}}),app.factory("calculator",function(){function a(a,b,c){var d;return d=.99*c>a?.423*c:2.72*c>a?.225*c+.2*a:3.11*c>a?.77*c:7.88*c>a?1.081*c-.1*a:.293*c,100*Math.ceil(d/100)*b/12}function b(b,c){var d=a(b,c,h);return(b-d)*i+Math.max(0,.2*(b-d-j))+Math.max(0,.05*(b-d-k))}function c(a,b,c,d){return.91*d>a?Math.max((a-b)*c,0):2.94*d>a?(.91*d+.332*(a-.91*d)-b)*c:8.08*d>a?(1.584*d+.111*(a-2.94*d)-b)*c:(2.155*d-b)*c}function d(a,b){var c=12*a,d=10*b;return c>d?10*b*.97*.8/365*30.4:.8*c*.97/365*30.4}function e(a,b){var c=12*a,d=10*b;return c>d?a-240*b/365-3*c/365:a-27*c/365}function f(a,b,c){var d=Math.min(a,12-a)-c;return 30*Math.max(d,0)*b}var g={},h=44500,i=.3199,j=430200,k=616100,l=50,m=2,n=1050;return g.inkomstSpec=function(g,j,k){var o=12-j,p=Math.min(k,j),q=d(g,h)*j,r=e(g,h)*p,s=g*o+q+r,t=a(s,12,h),u=b(s,12),v=c(s-q,t,i,h),w=u-v,x=s-w,y=f(j,l,m),z=n/2*12,A=x+z+y,B=w/s,C=r*(1-B),D={lonBrutto:{label:"Arbetsinkomst (före skatt)",value:g*o,order:1},FP:{label:"Föräldrapenning (före skatt)",value:q,order:2},FL:{label:"Föräldralön (före skatt)",value:r,order:3},FLnetto:{label:"Föräldralön (efter skatt)",value:C,order:3.5},arsinkomst:{label:"Årsinkomst (före skatt)",value:s,order:4},JSA:{label:"Jobbskatteavdrag (per år)",value:v,order:5},GA:{label:"Grundavdrag (per år)",value:t,order:5},inkomstskatt:{label:"Inkomstskatt före JSA",value:u,order:6},inkomstskattEfterJSA:{label:"Inkomstskatt efter JSA",value:w,order:7},nettoInkomst:{label:"Inkomst efter skatt",value:x,order:8},JB:{label:"Jämställdhetsbonus",value:y,type:"skattefri",order:9},BB:{label:"Barnbidrag",value:z,type:"skattefri",order:10},disponibelInkomst:{label:"Disponibel inkomst",value:A,order:11}};return D},g}),app.factory("chart",["$filter",function(a){{var b=a("currency"),c={};d3.locale({decimal:",",thousands:" ",grouping:[3],currency:[""," kr"],dateTime:"%A %e %B %Y kl. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["måndag","tisdag","onsdag","torsdag","fredag","lördag","söndag"],shortDays:["må","ti","ons","to","fre","lö","sö"],months:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],shortMonths:["jan","feb","mars","apr","maj","jun","jul","aug","sept","okt","nov","dec"]})}return c.options={series:[{y:"disponibelInkomst",label:"Hushållets inkomst",color:"#008ea1",axis:"y",type:"area",thickness:"1px",dotSize:3,striped:!1,id:"disponibelInkomst"},{y:"FLnetto",label:"Föräldralön",color:"#E27748",axis:"y",type:"area",thickness:"1px",dotSize:3,striped:!0,id:"FLnetto"}],stacks:[{axis:"y",series:["disponibelInkomst","FLnetto"]}],axes:{x:{type:"linear",labelFunction:function(a){return""},key:"x"},y:{type:"linear",labelFunction:function(a){return""},ticks:5}},lineMode:"linear",tension:.7,dimensions:{right:5,left:5},tooltip:{mode:"scrubber",formatter:function(a,c,d,e){return"disponibelInkomst"==e.y?"Varav föräldralön: "+b(d-c,void 0,0):"FLnetto"==e.y?"Total inkomst: "+b(d,void 0,0):void 0}},drawLegend:!0,drawDots:!0,columnsHGap:5},c}]),app.factory("pym",function(){var a={},b=null;return a.isIframe=self!==top,a.isIframe&&(b=new pym.Child),a.sendHeight=function(){b&&b.sendHeight()},a});