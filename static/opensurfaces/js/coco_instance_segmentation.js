//write functions here
function Ctrler(){
    this.N = 0;
    this.cur_anno_idx = 0;
    this.originX;
    this.originY;
    this.im = new Image();
    // use cat icon for demo
    var cat_id = 17;
    this.im.src = 'static/img/categories/'+cat_id+'.png';
    this.zoomLevel = 0;
}
// center icon
Ctrler.prototype.centerIcon = function(){
    var stage_ui = window.controller_ui.s.stage_ui;
    var imWid = stage_ui.size['width'];
    var imHei = stage_ui.size['height'];
    var bbox = window.controller_ui.s.stage_ui.bbox;
    var zoom =   ctrler.getZoomFactor();
    origin = ctrler.getOrigin();
    // compute new origin
    stage_ui.translate_delta(Anno[0][0]* imWid- imWid/2/zoom - origin['x'], Anno[0][1]*imHei- imHei/2/zoom - origin['y']);
    setTimeout(function(){ctrler.renderHint();}, 300);
}
Ctrler.prototype.zoomAtCenter = function(delta){
    var stage_ui = window.controller_ui.s.stage_ui;
    var imWid = stage_ui.size['width'];
    var imHei = stage_ui.size['height'];
    var p = new Object();
    p['x'] = imWid/2
    p['y'] = imHei/2
    stage_ui.zoom_delta(delta,p);
}
//render hint
Ctrler.prototype.renderHint = function(){
    var stage_ui = window.controller_ui.s.stage_ui;
    var imWid = stage_ui.size['width'];
    var imHei = stage_ui.size['height'];
    var ctx = $('canvas')[0].getContext('2d');
    var icon_size=20;

    for (i=0; i < ctrler.N; i++){
        var x = Anno[i][0];
        var y = Anno[i][1];
        var left = x * imWid;
        var top =  y * imHei;
        var container = $('#mt-container');
        var offsetX = parseFloat(container.position().left);
        var offsetY = parseFloat(container.position().top );
        // adjust with new zoom and origin
        var origin = ctrler.getOrigin();
        var zoom =   ctrler.getZoomFactor();
        left = (left - origin['x'])*zoom;
        top  = (top  - origin['y'])*zoom;
        if (left >0 && left < Math.min($(window).width()-icon_size/2, imWid*zoom) &&
            top > 0 && top < Math.min( $(window).width()-icon_size/2, imHei*zoom)){
            for (k = 0; k < polys.length; k++){
                ctx.beginPath();
                vertex = polys[k];
                ctx.moveTo((vertex[0]*imWid - origin['x'])*zoom, (vertex[1]*imHei-origin['y'])*zoom);
                for (j=2; j< vertex.length; j+=2){
                    ctx.lineTo((vertex[j]*imWid - origin['x'])*zoom, (vertex[j+1]*imHei-origin['y'])*zoom);
                }
                ctx.closePath();
                ctx.fillStyle = 'rgba(0,0,255, 0.5)';
                ctx.stroke();
                ctx.fill();
            }
            ctx.drawImage(ctrler.im, left-15, top-15, 30, 30);
        }
    }

}
Ctrler.prototype.getOrigin = function(){
    return window.controller_ui.s.stage_ui.origin
}
Ctrler.prototype.getZoomFactor = function(){
    return window.controller_ui.s.stage_ui.get_zoom_factor()
}
Ctrler.prototype.getPolys = function(){
    // polygon points:
    return window.controller_ui.s.closed_polys
}
Ctrler.prototype.submitNoObj = function(){
      if (!mt_submit_ready) {
        return;
      }
      window.show_modal_loading("Submitting...", 0);
      var data = $.extend(true, {
                    screen_width: screen.width,
                    screen_height: screen.height,
                    time_load_ms: window.time_load_ms
                  }, data);
      var ans = JSON.stringify(data);
      var duration = ($.now()-init_time)/1000;
      var resp =
        {'ans':ans,
         'duration': duration,
         'assignmentId':$('#assignmentId').val(),
         'workerId': $('#workerId').val(),
         'hitId': $('#hitId').val(),
         'isObj': 0,
        };
        $("input[name='duration']").val(duration)
        $("input[name='ans']").val(ans);
        $("input[name='isObj']").val(0);
      return $.ajax({
        type: 'POST',
        url: window.location.href,
        data: {'resp': JSON.stringify(resp)} ,
        timeout: 60000,
      }).done( function(data) {
          if (data == 'reload'){
              window.location.reload();
          }else if (data = 'submit'){
              $('#mturk_form').submit();
          }else{
              alert('error');
              window.hide_modal_loading();
          }
      }).fail( function(data){
          alert('Timeout, please click "Next" again to submit your HIT');
          window.hide_modal_loading();
      }) ;
}
Ctrler.prototype.submit_form = function(data_callback) {
      var data, feedback;
      if (!mt_submit_ready) {
        return;
      }
      window.show_modal_loading("Submitting...", 0);
      data = data_callback();
      if (window.ask_for_feedback) {
        feedback = typeof window.get_modal_feedback === "function" ? window.get_modal_feedback() : void 0;
      }
      if ((feedback != null) && !$.isEmptyObject(feedback)) {
        data.feedback = JSON.stringify(feedback);
      }
      console.log("submit data:");
      console.log(data);
      var data = $.extend(true, {
                    screen_width: screen.width,
                    screen_height: screen.height,
                    time_load_ms: window.time_load_ms
                  }, data);
      var ans = JSON.stringify(data);
      var duration = ($.now()-init_time)/1000;
      var resp =
        {'ans':ans,
         'duration': duration,
         'assignmentId':$('#assignmentId').val(),
         'workerId': $('#workerId').val(),
         'hitId': $('#hitId').val(),
         'isObj': 1,
        };
        $("input[name='duration']").val(duration)
        $("input[name='ans']").val(ans);
        $("input[name='isObj']").val(1);
      return $.ajax({
        type: 'POST',
        url: window.location.href,
        data: {'resp': JSON.stringify(resp)} ,
        timeout: 60000,
      }).done( function(data) {
          if (data == 'reload'){
              window.location.reload();
          }else if (data = 'submit'){
              $('#mturk_form').submit();
          }else{
             alert('error');
             window.hide_modal_loading();
          }
      }).fail( function(data){
          alert('Timeout, please click "Next" again to submit your HIT');
          window.hide_modal_loading();
      }) ;
    }
Ctrler.prototype.addListener = function(){
    $('#btn-zoom-in').bind('click', function(e){
        ctrler.zoomAtCenter(600);
        ctrler.zoomLevel++;
        ctrler.renderHint();
        return stop_event(e);
    });
    $('#btn-zoom-out').bind('click', function(e){
        ctrler.zoomAtCenter(-600);
        ctrler.renderHint();
        return stop_event(e);
    });
    $('#btn-move').bind('click', function(e){
        ctrler.centerIcon();
        return stop_event(e);
        //return stop_event(ev);
    });
    $(document).keydown(function(ev){
        if (ev.keyCode == 77 || ev.keyCode == 109){
            $('#btn-move').trigger('click');
        }else if(ev.keyCode == 73 || ev.keyCode == 105){
            $('#btn-zoom-in').trigger('click');
        }else if(ev.keyCode == 79 || ev.keyCode == 111){
            $('#btn-zoom-out').trigger('click');
        }else if(ev.keyCode == 37 || ev.keyCode == 38){
        }
    } );
    $('#btn-submit-noobj').bind('click', ctrler.submitNoObj);
    $(document).keypress( function(ev){
        if (ev.keyCode == 37 || ev.keyCode == 38){
            setTimeout(function(){
                ctrler.renderHint();}, 100);
        }
    });
}
// polygonal comparison
function isPointInPoly(poly, pt){
    nvert = poly.length
    var c = false;
    for(i = 0, j = nvert - 1; i < nvert; j = i++){
        if ( (poly[i]['y'] > pt['y'] )!=(poly[j]['y']>pt['y']) &&
             (pt['x'] < (poly[j]['x']-poly[i]['x']) * (pt['y']-poly[i]['y']) / (poly[j]['y']-poly[i]['y']) + poly[i]['x'] )){
            c = !c;
        }
    }
    return c;
}

function accOfOverlappedPolygons(poly1, poly2){
    var bbox = getbboxOfPolys(poly1, poly2);
    var intersection = 0;
    var union = 0;
    var poly1Pixel = 0;
    var poly2Pixel = 0;
    for (var i = bbox['x_min']; i < bbox['x_max']; i++){
        for (var j = bbox['y_min']; j < bbox['y_max']; j++){
            var pt = new Object();
            pt = {'x':i, 'y':j};
            var inPoly1 = isPointInPoly(poly1, pt);
            var inPoly2 = isPointInPoly(poly2, pt);
            if (inPoly1 || inPoly2){
                union++;
            }
            if (inPoly1){
                poly1Pixel++;
            }
            if(inPoly1 ^ inPoly2){
                intersection++;
            }
        }
    }
    return intersection/poly1Pixel;
}
function getbboxOfPolys(poly1, poly2){
    bbox1 =getbbox(poly1);
    bbox2 =getbbox(poly2);
    var bbox = new Object();
    bbox['x_min'] = Math.min(bbox1['x_min'], bbox2['x_min']);
    bbox['y_min'] = Math.min(bbox1['y_min'], bbox2['y_min']);
    bbox['x_max'] = Math.max(bbox1['x_max'], bbox2['x_max']);
    bbox['y_max'] = Math.max(bbox1['y_max'], bbox2['y_max']);
    return bbox
}
function getbbox(poly){
    var x_min=1000000, x_max=0, y_min=100000, y_max = 0;
    for (var i=0; i<poly.length; i++){
        if (x_min > poly[i]['x']){x_min = poly[i]['x'];};
        if (x_max < poly[i]['x']){x_max = poly[i]['x'];};
        if (y_min > poly[i]['y']){y_min = poly[i]['y'];};
        if (y_max < poly[i]['y']){y_max = poly[i]['y'];};
    }
    return {'x_min':x_min, 'x_max':x_max, 'y_min':y_min, 'y_max':y_max,}
}
// windows
var ctrler;
$(window).load(function(){
    // append a invisible annotation
    // set up things
    ctrler = new Ctrler();
    ctrler.N = Anno.length;
    // redner things
    ctrler.renderHint();
    // ctrler.centerIcon();
    ctrler.addListener();
    window.controller_ui.s.stage_ui.layer.afterDrawFunc = ctrler.renderHint
});
