// Ctrler controls the state of UI and rendering
function Ctrler(){
    this.N = 0;
    this.cur_img_idx = 0;  // image
    this.cur_obj_idx = 0;  // object category
    this.cur_anno_idx = 0;// annotation from 1 to 10, start from 0 
    this.len_ratio = 2;
    this.hint_status = false;
}
// render image panel for given working image id
Ctrler.prototype.render_im_panel = function(){
    for (i = 0; i < this.N; i++){
        if (i == this.cur_img_idx){
            $('#im-panel-'+i).find('img').attr('src', Im[i].src);
            $('#im-panel-'+i).show();
        }else{
            $('#im-panel-'+i).hide();
        }
    }
    for (i = 0; i < this.N; i++){
        if (i == this.cur_img_idx){
            $('#category-panel-'+i).show();
        }else{
            $('#category-panel-'+i).hide();
        }
    }
    this.render_bgim();
}
// render category panel which includes icon and examples
Ctrler.prototype.render_category_panel = function(){
    var i = this.cur_img_idx;
    var j = this.cur_obj_idx;
    var cat_id = Anno[i].cat_id
    var src = 'static/img/categories/' + cat_id[0] + '.png';
    // render icon
    var cat_div = $('#div-cat-img');
    cat_div.find('img').attr('src', src);
    cat_div.find('img').css('width',  80);
    cat_div.find('img').css('height', 80);
    // redner name
    $('#div-cat-name').html(cat_name);
}
Ctrler.prototype.render_hint = function(){
    $('.hint').stop(true);
    // load annotation from stage 2
    // render saved annotation for the first time
    var i = this.cur_img_idx;
    var j = this.cur_obj_idx;
    var x = Anno[i].x[j];
    var y = Anno[i].y[j];
    var img = $('#img-'+i);
    // compute hint's position
    var img_left = img.position().left;
    var img_top  = img.position().top;
    var img_wid  = parseFloat(img.css('width'));
    var img_hei  = parseFloat(img.css('height'));
    var pos_x = Math.round(img_left+x*img_wid);
    var pos_y = Math.round(img_top+y*img_hei);
    // show hints
    $('.hint').css('left', pos_x);
    $('.hint').css('top', pos_y);
    var cat_id = Anno[i].cat_id
    var src = 'static/img/categories/' + cat_id + '.png';
    $('.hint-img').attr('src', src);
    var s = 400;
    $('.hint').fadeTo(s,0.1).fadeTo(s,1).fadeTo(s,0.1).fadeTo(s,1).fadeTo(s, 0);
}
// render annotation
Ctrler.prototype.render_anno = function(){
    // image index, object category index, annotation index
    var i = this.cur_img_idx;
    var j = this.cur_obj_idx;
    var k = this.cur_anno_idx;

    for (k=0;k<10;k++){
        if (Anno[i].ans[j][k] == 1){
            var e = new Object();          
            e.pageX = Anno[i].annoloc[j][k][0];
            e.pageY = Anno[i].annoloc[j][k][1];
            showMarker(i,j,k, e);
            Marker[k].css('left', e.pageX-15);
            Marker[k].css('top', e.pageY-31);
        }else{
            hideMarker(i,j,k);
        }
    }
    // set visible & marker_bg
    for (idx=0; idx<10; idx++){
        if (Marker[idx].data('show') == 1){
            Marker[idx].show();
            Marker_bg[idx].hide()
        }else{
            Marker[idx].hide();
            Marker_bg[idx].hide();
        }
    }
    var count = 0;
    for (p = 0; p<10; p++){
        if (Marker[p].data('show')==1){
            count++;
        }
    }
    $('#anno_status').html('<div style="color:blue;display:inline">' + count +'</div> cat(s) found in this image.');
}
// render background image
Ctrler.prototype.render_bgim = function(){
    var i = this.cur_img_idx;
    var ratio = this.len_ratio;
    $('#bgim').css({ backgroundImage: "url('" + Im[i].src + "')" })
    $('#bgim').css('background-size', parseFloat(Im[i].width)*ratio+ "px " + parseFloat(Im[i].height)*ratio + 'px');
}

Ctrler.prototype.renderLen = function(e){
    var i = ctrler.cur_img_idx;
    var obj = $('#img-'+i);
    var obj2 = $('#category-panel');
    var target = $('#bgim');
    var offset = obj.offset();
    var widthRatio = ctrler.len_ratio;
    var heightRatio = ctrler.len_ratio;
    var leftPos = parseInt(e.pageX - offset.left);
    var topPos = parseInt(e.pageY - offset.top);
    if (leftPos < 0 || topPos < 0 || leftPos > obj.width() || topPos > obj.height()) {
        target.hide();
    }
    else {
        target.show();

        bgleftPos = String(((e.pageX - offset.left) * widthRatio - target.width() / 2) * (-1));
        bgtopPos = String(((e.pageY - offset.top) * heightRatio - target.height() / 2) * (-1));
        target.css({ backgroundPosition: bgleftPos + 'px ' + bgtopPos + 'px' });

        var leftPos = String(e.pageX - target.width() / 2);
        var topPos = String(e.pageY - target.height() / 2);
        target.css({ left: leftPos + 'px', top: topPos + 'px' });
        // render Marker on background layer
        for (i=0; i<10; i++){
            if (Marker[i].data('show') == 1){
                left_marker = parseFloat(Marker[i].css('left') )-obj.position().left;
                top_marker =  parseFloat(Marker[i].css('top')  )-obj.position().top;
                wid_marker = parseFloat(Marker[i].css('width') );
                hei_marker = parseFloat(Marker[i].css('height'));

                if (Marker_bg[i].data('ondrag') != 'TRUE'){
                    Marker_bg[i].css('left', (left_marker*2 +parseFloat(bgleftPos)+(wid_marker/2) + parseFloat(leftPos) ));
                    Marker_bg[i].css('top',  (top_marker*2  +parseFloat(bgtopPos) +(hei_marker/2) + parseFloat(topPos)  ));
                }
                // if Marker_bg is in radius, show it, else hide it
                var abs_left = parseFloat(Marker_bg[i].css('left')) - parseFloat(Marker[i].css('left'));
                var abs_top  = parseFloat(Marker_bg[i].css('top'))  - parseFloat(Marker[i].css('top'));
                if (abs_left*abs_left + abs_top*abs_top < 25*25){
                    Marker_bg[i].show();
                    Marker[i].hide();
                }else{
                    Marker_bg[i].hide();
                    Marker[i].show();
                }
            }
        }
    }
}

// render previous image
Ctrler.prototype.back = function(){
    var i = this.cur_img_idx;
    var j = this.cur_obj_idx;
    this.cur_obj_idx--;
    if (this.cur_obj_idx < 0){
        this.cur_img_idx--;
        if (this.cur_img_idx < 0){
             this.cur_img_idx++;
             this.cur_obj_idx++;
        }else{
            this.cur_obj_idx = Anno[i-1].cat_id.length-1;
            this.render_im_panel();
        }
    }
    var i = this.cur_img_idx;
    var j = this.cur_obj_idx;
    this.render_category_panel();
    this.render_anno();
    this.render_hint();
}

// render next image
Ctrler.prototype.next = function(){
    var i = this.cur_img_idx;
    var j = this.cur_obj_idx;
    var k = Anno[i].cat_id.length;
    this.cur_obj_idx++;
    if (this.cur_obj_idx >= k){
        this.cur_img_idx++;
        if (this.cur_img_idx >= this.N){
            this.cur_obj_idx--;
            this.cur_img_idx--;
             $( "#dialog-confirm" ).dialog( "open" );
             $( ".ui-dialog" ).css('top', window.scrollY+200);
             $( ".ui-dialog" ).css('left', window.scrollX+200);
        }else{
            this.cur_obj_idx = 0;
            this.render_im_panel();
            this.render_category_panel();
            this.render_anno();
            this.render_hint();
            $('html, body').scrollTop( $(document).height() - $(window).height() );
        }
    }
}


// add Markers
Ctrler.prototype.addMarker = function(ev, flag){
    if (ev.which == 1){
        var i = ctrler.cur_img_idx;
        var j = ctrler.cur_obj_idx;
        var k = 10;
        for (p = 0; p<10; p++){
            if (Marker[p].data('show')==0){
                k = p;
                break;
            }
        }
        if (k == 10){
            ctrler.next();
            return 0;
        }
        // add marker
        var wid = parseFloat(Marker[k].css('width'));
        var hei = parseFloat(Marker[k].css('height'));
        var leftPos = parseFloat(ev.pageX);
        var topPos =  parseFloat(ev.pageY);
        var leftPosIm = $('#img-'+i).position().left;
        var topPosIm =  $('#img-'+i).position().top;
        var widIm = parseFloat($('#img-'+i).css('width'));
        var heiIm = parseFloat($('#img-'+i).css('height'));
        var offset = 0;
        // check if 10 markers
        if (leftPos > leftPosIm-offset && leftPos < leftPosIm+widIm+offset && 
            topPos >  topPosIm -offset && topPos  < topPosIm +heiIm+offset){
            Marker[k].css('left', leftPos -wid/2);
            Marker[k].css('top',  topPos -hei/2);
            showMarker(i,j,k, ev);
            ctrler.render_anno();
        }
        ctrler.renderLen(ev);
    }
}

// delete Markers
Ctrler.prototype.deleteMarker = function(ev, kk){
    // i: index of the object
    var i = ctrler.cur_img_idx;
    var j = ctrler.cur_obj_idx;
    var k = ctrler.cur_anno_idx;
    ev.preventDefault();
    if (ev.which == 3){
        // click event
        hideMarker(i,j, kk);
        ctrler.render_anno();
    }
}

// add mouse and keyboard listener
function addListener(){
    //=============== Keyboard Lisenter =====================
    $(document).keyup(function(ev){
        // Confirmation stage
        if (ev.keyCode==78 || ev.keyCode==110){ //space
            ctrler.next();
        }
        if(ev.keyCode == 72 || ev.keyCode == 104){ //h
            ctrler.render_hint();
        }
        if(ev.keyCode == 66 || ev.keyCode == 98){ //b
            ctrler.back();
        }
    });
    $('#button-next').bind('click', function(){ctrler.next()});
    $('#button-hint').bind('click', function(){ctrler.render_hint()});
    $('#button-back').bind('click', function(){ctrler.back()});
    //=============== mouse Lisenter =====================
    $('#bgim').bind('click', function(ev){
        // left click add markers
        ctrler.addMarker(ev,0);
    });
    $('.anno').bind('click', function(ev){
        // left click add markers
        ctrler.addMarker(ev,0);
    });
    // right click listener on anno
    $('.anno').bind('mouseup', function(ev){
        ctrler.deleteMarker(ev, $(this).data('idx'));
    });
    // mouse over Listener for rendering Lens
    $('#bgim').bind(  'mousemove', ctrler.renderLen);
    $('.img' ).bind(  'mousemove', ctrler.renderLen);
    $('.imgdiv').bind('mousemove', ctrler.renderLen);
    $('.anno').bind(  'mousemove', ctrler.renderLen);
}

function addDialog(){
    $( "#dialog-confirm" ).dialog({
      autoOpen: false,
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Yes": function() {
          $( this ).dialog( "close" );
          submit_form();
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });  
    $( ".ui-dialog" ).css('position', 'absolute'); 
}

// add markers
function createMarker(){
    for (i=0; i < 10; i++){
        Marker[i] = $('<div class="anno" id="anno-'+i+'">+</div>');
        Marker[i].data('show',0);
        Marker[i].data('idx',i);
        Marker[i].appendTo($('#category-panel'));
        Marker_bg[i] = $('<div class="anno" id="anno_bg-'+i+'">+</div>');
        Marker_bg[i].data('idx', i);
        Marker_bg[i].css('z-index', 10000);
        Marker_bg[i].appendTo($('#category-panel'));
        
        Marker_bg[i].draggable({
            cursor: 'move',
            cursorAt: { top: 31, left: 15.5 },
            start: function (e, ui){
                var k = $(this).data('idx');
                Marker[k].data('x', e.pageX-15.5);
                Marker[k].data('y', e.pageY-30);
                Marker[k].css('left', e.pageX-15.5);
                Marker[k].css('top', e.pageY-30);
                Marker_bg[k].css('left', e.pageX-15.5);
                Marker_bg[k].css('top', e.pageY-30);
                Marker_bg[k].data('ondrag',  'TRUE');
            },
            drag: function (e, ui) {
                // reset Marker's position
                var i = ctrler.cur_img_idx;
                var j = ctrler.cur_obj_idx;
                var k = $(this).data('idx');
                var offsetX = parseFloat(Marker_bg[k].css('width'));
                var offsetY = parseFloat(Marker_bg[k].css('height'));
                Marker[k].css('left', e.pageX-offsetX/2);
                Marker[k].css('top',  e.pageY-offsetY/2);
                if (Anno[i].ans[j] == -1){
                    Anno[i].ans[j] = 1;
                    Marker[0].css('color', 'blue');
                    Marker[0].html('+');
                }
            }, 
            stop: function (e, ui) {
                var k = $(this).data('idx');
                var i = ctrler.cur_img_idx;
                var j = ctrler.cur_obj_idx;
                Marker_bg[k].data('ondrag',  'FALSE');
                var wid = parseFloat(Marker[k].css('width'));
                var hei = parseFloat(Marker[k].css('height'));
                var leftPos = parseFloat(e.pageX);
                var topPos =  parseFloat(e.pageY);
                var leftPosIm = $('#img-'+i).position().left;
                var topPosIm =  $('#img-'+i).position().top;
                var widIm = parseFloat($('#img-'+i).css('width'));
                var heiIm = parseFloat($('#img-'+i).css('height'));
                var offset = 0;
                if (!(leftPos > leftPosIm-offset && leftPos < leftPosIm+widIm+offset &&
                    topPos >  topPosIm -offset && topPos  < topPosIm +heiIm+offset)){
                    hideMarker(i, j, k);
                }else{
                    showMarker(i, j, k, e);
                }
                ctrler.render_anno();
                ctrler.renderLen(e);
            }
        });
        hideMarker(0,0,i);
    }
}

function showMarker(i,j,k,e){
    Marker[k].data('show' ,  1);
    Anno[i].ans[j][k] = 1;
    Anno[i].annoloc[j][k] = [e.pageX, e.pageY];
    var im = $('#img-'+i);
    var imLeft = im.position().left;
    var imTop = im.position().top;
    var imWid = Im[i].width;
    var imHei = Im[i].height;
    var x = (e.pageX - imLeft)/imWid;
    var y = (e.pageY - imTop)/imHei;
    Anno[i].annoloc_percentage[j][k] = [x, y];
}
function hideMarker(i,j,k){
    Marker[k].data('show' ,  0);
    Anno[i].ans[j][k] = 0;
    Anno[i].annoloc[j][k] = [-1, -1];
    Anno[i].annoloc_percentage[j][k] = [-1, -1];
}

// script starts here
function imClick_Ctrl(){
    ctrler = new Ctrler();
    ctrler.N = Anno.length;
    createMarker();
    addDialog();
    // redner image
    ctrler.render_im_panel(); // render image and bg image
    ctrler.render_category_panel();
    ctrler.render_anno();
    // add listner after things set up
    addListener();
    // set finishing dialog
    ctrler.render_hint();
}

