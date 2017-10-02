var task_cursor = 0;
// define timer
var init_time;
// flag for images that can't be loaded
// these images will be skipped
var im_err = [];

// number of images in this HIT
var N_task = im_urls.length;

// define supercateogry and category as array
var supercats = [];
var categories = [];

// define icons for all tasks
// icons_all is a two dimensional array
// first index for images and the second index for icons
// the normalized (x,y) coordinates is stored in each icon
var icons_all = [];

// define questions
var questions = [];

// define state variables that controls ui
var supercat_cursor = [];
for (i=0; i < N_task; i++){
    supercat_cursor[i] = 0;
}

function initialize_anncats(){
    // timer
    init_time = $.now();
    // prepare data
    // initialize images
    for (i=0; i < im_urls.length; i++){
        var im = new Image();
        var q = new Object();
        im.src = im_urls[i];
        q.im = im;
        q.ans = '';
        // TODO: add fields for identifying images here
        questions.push(q);
    }
    $("#example").attr("src", STATIC_ROOT + "/images/category_labeling/example.jpg");
    $("#nimages").append(im_urls.length);

    // define supercategory
    // each task contains 11 sets of supercategory to annotate
    supercats[0]  = {'name':"person and accessory",'id':1}
    supercats[1]  = {'name':"animals",'id':4}
    supercats[2]  = {'name':"vehicles",'id':2}
    supercats[3]  = {'name':"street-view",'id':3}
    supercats[4]  = {'name':"sports",'id':6}
    supercats[5]  = {'name':"food",'id':8}
    supercats[6]  = {'name':"kitchenware",'id':7}
    supercats[7]  = {'name':"appliances",'id':11}
    supercats[8]  = {'name':"furniture",'id':9}
    supercats[9]  = {'name':"small indoor",'id':12}
    supercats[10] = {'name':"electronics",'id':10}

    // define categories
    categories = [{"supercat_id": 1, "name": "person", "cat_id": 1}, {"supercat_id": 2, "name": "bicycle", "cat_id": 2}, {"supercat_id": 2, "name": "car", "cat_id": 3}, {"supercat_id": 2, "name": "motorcycle", "cat_id": 4}, {"supercat_id": 2, "name": "airplane", "cat_id": 5}, {"supercat_id": 2, "name": "bus", "cat_id": 6}, {"supercat_id": 2, "name": "train", "cat_id": 7}, {"supercat_id": 2, "name": "truck", "cat_id": 8}, {"supercat_id": 2, "name": "boat", "cat_id": 9}, {"supercat_id": 3, "name": "traffic light", "cat_id": 10}, {"supercat_id": 3, "name": "fire hydrant", "cat_id": 11}, {"supercat_id": 3, "name": "stop sign", "cat_id": 13}, {"supercat_id": 3, "name": "parking meter", "cat_id": 14}, {"supercat_id": 3, "name": "bench", "cat_id": 15}, {"supercat_id": 4, "name": "bird", "cat_id": 16}, {"supercat_id": 4, "name": "cat", "cat_id": 17}, {"supercat_id": 4, "name": "dog", "cat_id": 18}, {"supercat_id": 4, "name": "horse", "cat_id": 19}, {"supercat_id": 4, "name": "sheep", "cat_id": 20}, {"supercat_id": 4, "name": "cow", "cat_id": 21}, {"supercat_id": 4, "name": "elephant", "cat_id": 22}, {"supercat_id": 4, "name": "bear", "cat_id": 23}, {"supercat_id": 4, "name": "zebra", "cat_id": 24}, {"supercat_id": 4, "name": "giraffe", "cat_id": 25}, {"supercat_id": 1, "name": "backpack", "cat_id": 27}, {"supercat_id": 1, "name": "umbrella", "cat_id": 28}, {"supercat_id": 1, "name": "handbag", "cat_id": 31}, {"supercat_id": 1, "name": "tie", "cat_id": 32}, {"supercat_id": 1, "name": "suitcase", "cat_id": 33}, {"supercat_id": 6, "name": "frisbee", "cat_id": 34}, {"supercat_id": 6, "name": "skis", "cat_id": 35}, {"supercat_id": 6, "name": "snowboard", "cat_id": 36}, {"supercat_id": 6, "name": "sports ball", "cat_id": 37}, {"supercat_id": 6, "name": "kite", "cat_id": 38}, {"supercat_id": 6, "name": "baseball bat", "cat_id": 39}, {"supercat_id": 6, "name": "baseball glove", "cat_id": 40}, {"supercat_id": 6, "name": "skateboard", "cat_id": 41}, {"supercat_id": 6, "name": "surfboard", "cat_id": 42}, {"supercat_id": 6, "name": "tennis racket", "cat_id": 43}, {"supercat_id": 7, "name": "bottle", "cat_id": 44}, {"supercat_id": 7, "name": "wine glass", "cat_id": 46}, {"supercat_id": 7, "name": "cup", "cat_id": 47}, {"supercat_id": 7, "name": "fork", "cat_id": 48}, {"supercat_id": 7, "name": "knife", "cat_id": 49}, {"supercat_id": 7, "name": "spoon", "cat_id": 50}, {"supercat_id": 7, "name": "bowl", "cat_id": 51}, {"supercat_id": 8, "name": "banana", "cat_id": 52}, {"supercat_id": 8, "name": "apple", "cat_id": 53}, {"supercat_id": 8, "name": "sandwich", "cat_id": 54}, {"supercat_id": 8, "name": "orange", "cat_id": 55}, {"supercat_id": 8, "name": "broccoli", "cat_id": 56}, {"supercat_id": 8, "name": "carrot", "cat_id": 57}, {"supercat_id": 8, "name": "hot dog", "cat_id": 58}, {"supercat_id": 8, "name": "pizza", "cat_id": 59}, {"supercat_id": 8, "name": "donut", "cat_id": 60}, {"supercat_id": 8, "name": "cake", "cat_id": 61}, {"supercat_id": 9, "name": "chair", "cat_id": 62}, {"supercat_id": 9, "name": "couch", "cat_id": 63}, {"supercat_id": 9, "name": "potted plant", "cat_id": 64}, {"supercat_id": 9, "name": "bed", "cat_id": 65}, {"supercat_id": 9, "name": "dining table", "cat_id": 67}, {"supercat_id": 9, "name": "toilet", "cat_id": 70}, {"supercat_id": 10, "name": "tv", "cat_id": 72}, {"supercat_id": 10, "name": "laptop", "cat_id": 73}, {"supercat_id": 10, "name": "mouse", "cat_id": 74}, {"supercat_id": 10, "name": "remote", "cat_id": 75}, {"supercat_id": 10, "name": "keyboard", "cat_id": 76}, {"supercat_id": 10, "name": "cell phone", "cat_id": 77}, {"supercat_id": 11, "name": "microwave", "cat_id": 78}, {"supercat_id": 11, "name": "oven", "cat_id": 79}, {"supercat_id": 11, "name": "toaster", "cat_id": 80}, {"supercat_id": 11, "name": "sink", "cat_id": 81}, {"supercat_id": 11, "name": "refrigerator", "cat_id": 82}, {"supercat_id": 12, "name": "book", "cat_id": 84}, {"supercat_id": 12, "name": "clock", "cat_id": 85}, {"supercat_id": 12, "name": "vase", "cat_id": 86}, {"supercat_id": 12, "name": "scissors", "cat_id": 87}, {"supercat_id": 12, "name": "teddy bear", "cat_id": 88}, {"supercat_id": 12, "name": "hair drier", "cat_id": 89}, {"supercat_id": 12, "name": "toothbrush", "cat_id": 90}]

    // define icons
    for (i=0; i < im_urls.length; i++){
        var icons = [];
        for (j=0; j < categories.length; j++){
            var cat = categories[j];
            var img_src = STATIC_ROOT + "/images/categories/"+cat.cat_id+".png";
            icons.push({
                'name': cat.name,
                'supercat_id':cat.supercat_id,
                'cat_id': cat.cat_id,
                'div':$('<div class="div-icon"><div class="caption"><p>cat.name</p></div><img class="icon" src='+img_src+'></img></div>'),
                'div1':$('<div class="div-icon-selected"><img class="icon-selected" src='+img_src+'></img></div>'),
                'isselected':0,
                'panel_idx':-1,
                'x':0,
                'y':0,
                'drag_time':0,

            });
            icons_all[i] = icons;
        }
    }

    // prepare for interactive icon panel
    // icons_all[i][j], i: images, j: icons
    for (var i=0; i < im_urls.length; i++){
        for (var j=0; j< icons.length; j++){
            icons_all[i][j]['div'].data('idx',j);
            icons_all[i][j]['div1'].data('idx',j);
            icons_all[i][j]['div'].data('img_idx',i);
            icons_all[i][j]['div1'].data('img_idx',i);
            // Set draggable
            icons_all[i][j]['div'].draggable({
                cursor:"move",
                start: function(ev){
                    var i = $(this).data('img_idx');
                    var idx = $(this).data('idx');
                    var isselected = icons_all[i][idx]['isselected'];
                    if (isselected == 0){
                        $(this).find('p').html('');
                    }
                    $(this).data('clientX', ev.clientX);
                    $(this).data('clientY', ev.clientY);
                    $(this).data('drag_start_time', ev.timeStamp);
                    if ($(this).css('position') == 'absolute'){
                        var top =  $(document).scrollTop() + ev.clientY-20;
                        var left = $(document).scrollLeft() + ev.clientX-20;
                        $(this).css('top', top);
                        $(this).css('left', left);
                    }
                },
                stop: function(ev){
                    var i = $(this).data('img_idx');
                    var idx = $(this).data('idx');
                    var isselected = icons_all[i][idx]['isselected'];
                    // check if it's drop in image
                    var im_y = parseFloat($('#imdiv'+i).find('.image-task').position().top );
                    var im_x = parseFloat($('#imdiv'+i).find('.image-task').position().left);
                    var im_w = parseFloat($('#imdiv'+i).find('.image-task').css('width'));
                    var im_h = parseFloat($('#imdiv'+i).find('.image-task').css('height'));
                    var icon_x = ($(this).position().left+20.0       - im_x)/im_w;
                    var icon_y = ($(this).position().top +20.0       - im_y)/im_h;
                    icons_all[i][idx]['drag_time'] += -$(this).data('drag_start_time') + ev.timeStamp;
                    if (icon_x < -0.01 || icon_x > 1.01 || icon_y < -0.01 || icon_y > 1.01){
                        if (isselected==1){
                            $(this).trigger('click');   // equal to de-select the icon
                        }else{
                            $(this).css('left', 0);     // go back to their original position
                            $(this).css('top', 0);
                            $(this).find('p').html(icons_all[i][idx]['name']);
                        }
                        return -1;
                    }
                    $(this).data('drag_start_time');

                    if (isselected == 0){
                        icons_all[i][idx]['div1'].appendTo($('#cats_icons'+i));
                        icons_all[i][idx]['div'].css('border-color', 'green');
                        $(this).find('.caption').find('p').css('color', 'green');
                        icons_all[i][idx]['div1'].css('border-color', 'green');
                        icons_all[i][idx]['isselected'] = 1;
                        // change the content
                        $(this).find('p').html('');
                        $(this).css('width', '25px');
                        $(this).css('height', '25px');
                        $(this).find('img').css('width', '25px');
                        $(this).find('img').css('height', '25px');
                        // change the dom structure
                        $(this).detach();
                        $(this).appendTo('#imdiv'+i);
                        var top =  $(document).scrollTop() + ev.clientY-20;
                        var left = $(document).scrollLeft() + ev.clientX-20;
                        $(this).css('top', top);
                        $(this).css('left', left);
                        $(this).css('position', 'absolute');
                    }
                    // save position at the end of the drag
                    icons_all[i][idx]['x'] = ($(this).position().left - im_x)/im_w;
                    icons_all[i][idx]['y'] = ($(this).position().top  - im_y)/im_h;

                }
            });
        }
    }
    N = supercats.length;
    var im = [];
    for (i=0;i<im_urls.length;i++){
        url = im_urls[i];
        imdiv = $('#imdiv'+i);
        // image to be annotated
        im[i] = $('<div class="div-image"><img class="image-task" src="'+url+'"></img></div>');
        im[i].children().data('i',i);
        im[i].appendTo(imdiv);
        // prepare images after load image
        im[i].children().load(function(){
            // adapt to the scale of image
            var i = $(this).data('i');
            var imdiv = $(this).parent().parent();
            // div for icons that are in the image
            cats_icons = $('#cats_icons'+i);
            // deal with resizing the image
            var height = parseInt($(this).css('height'));
            var width = parseInt($(this).css('width'));
            if (width > height){
                $(this).css('width', '600px');
            }else{
                $(this).css('height', '450px');
            }
            var height_new = parseInt($(this).css('height'));
            $(this).parent().css('height', height_new + 'px');
            cats_icons.css('height', height_new + 'px');
            imdiv.css('height', height_new + 'px');
            cats_icons.appendTo(imdiv);
            // questions panel
            question = $('#div-task'+i);
            icon_and_arrow = $('<div class="div-icon-and-arrow"></div>');
            icon_and_arrow.appendTo(question);
            // buton panel right
            button_panel_left = $('<div class="button-panel"></div>')
            button_panel_right = $('<div class="button-panel"></div>')
            // question panael
            icons_panel = $('<div id="div-icons-panel'+i+'" class="div-icons-panel"></div>');
            button_panel_left.appendTo(icon_and_arrow);
            icons_panel.appendTo(icon_and_arrow);
            button_panel_right.appendTo(icon_and_arrow);
            // render div in question
            for (j=0;j<20;j++){
                icons_candidates = $('<div id="div-candidate-icons_'+i+'_'+j+'" class="div-candidate-icons"></div>');
                icons_candidates.appendTo(icons_panel);
            }
            button_panel = $('<div class="button-panel"></div>');
            button_panel.appendTo(imdiv);
            // add next and previous buttons
            button_next = $('<img id="button-next'+i+'" class="img-button" src="' + STATIC_ROOT + '/images/icons/right.png"></img>');
            button_next.bind('click', function(){
                nextTask();
            });
            button_panel_right.hover( function(){ $(this).find('img').attr('src', STATIC_ROOT + "/images/icons/right_green.png")},
                                      function(){ $(this).find('img').attr('src', STATIC_ROOT + "/images/icons/right.png")});

            button_prev = $('<img id="button-prev'+i+'" class="img-button" src="' + STATIC_ROOT +'/images/icons/left.png"></img>');
            button_prev.bind('click', function(){
                prevTask();
            });
            button_panel_left.hover( function(){ $(this).find('img').attr('src', STATIC_ROOT + "/images/icons/left_green.png")},
                                      function(){ $(this).find('img').attr('src', STATIC_ROOT + "/images/icons/left.png")});
            button_next.appendTo(button_panel_right);
            button_prev.appendTo(button_panel_left);
            // add progress bar
            progress = $('<div class="progress" id="progress'+i+'"></div>');//+
            progress_number = $('<div id="progress-number'+i+'" class="progress-number"></div>');
            progress.appendTo(question);
            progress_number.appendTo(question);
            progressbar = $('<div id="progressbar'+i+'" class="progressbar"></div>');
            progressbar.appendTo($('#progress'+i));
            progressbar.progressbar({
                value:1.0/N*100,
            });
            $(".progressbar").height(20);
            $(".progressbar").width(690);
            // progress number
            $('#progress-number'+i).html('1/'+N);
            // render icons
            addIconListener(icons_all[i], i);
            renderIcons(0, icons_all[i], i);
            if (i!=0 && task_cursor !=i){
                $('#task'+i).hide();
            }
        })
        .error(function(){
            var i = $(this).data('i');
            im_err[i] = -1;
            if (i==0){
                $('#task'+i).hide();
                $('#task'+1).show();
                task_cursor = 1;
            }
            console.log('error')
            $('#task'+i).hide();
        });
    }
    // key press listener
    $(document).keyup(function(ev){
        if (ev.keyCode==37){
            prevTask();
        }else if(ev.keyCode==39){
            nextTask();
        }
    });
}

// next task
function nextTask(){
     while(im_err[task_cursor] == -1){
         if (task_cursor == N_task -1){
             break;  // if it's the end of the task
         }
         task_cursor++;
     }
     idx = task_cursor;
     if (supercat_cursor[idx]<supercats.length-1){
         supercat_cursor[idx]++;
         renderIcons(supercat_cursor[idx], icons_all[idx], idx);
         // set progress
         $('#progress-number'+idx).html((supercat_cursor[idx]+1)+'/'+N);
         $("#progressbar"+idx).progressbar({value:((supercat_cursor[idx]+1)/N*100)});
         if (supercat_cursor[idx]==supercats.length-1){
             $('#progress-number'+idx).css('color', 'green');
         }
     }else{
        while(im_err[task_cursor+1] == -1){
            if (task_cursor == N_task -1){
                break;  // if it's the end of the task
            }
            task_cursor++;
        }
         if (task_cursor < N_task-1){
             task_cursor += 1;
             renderTask();
         }else{
             $( "#dialog-confirm" ).dialog( "open" );
             $( ".ui-dialog" ).css('top', window.scrollY+200);
             $( ".ui-dialog" ).css('left', window.scrollX+200);
         }
     }

}
// previous task
function prevTask(){
    var i = task_cursor;
    if (supercat_cursor[i]>0){
        supercat_cursor[i]--;
        renderIcons(supercat_cursor[i], icons_all[i], i);
        // set progress
        $('#progress-number'+i).html((supercat_cursor[i]+1)+'/'+N);
        $("#progressbar"+i).progressbar({value:((supercat_cursor[i]+1)/N*100)});
        $('#progress-number'+i).css('color', 'red');
    }else{
        if (task_cursor != 0){
            while(im_err[task_cursor-1] == -1){
                task_cursor--;
                if (task_cursor == 0){
                    break;  // if it's the end of the task
                }
            }
        }
        if (task_cursor == 0){
            alert('This is already the first task.');
        }else{
            task_cursor--;
            renderTask();
        }
    }

}
// clean icon panel
function cleanIconPanel(idx, icons){
    icons_children = $("#div-icons-panel"+idx).children().children();
    icons_children.detach();
}

function renderTask(){
    window.location = $('#anchor'+task_cursor).attr('href');
    for (i=0; i < N_task; i++){
        if (i==task_cursor){
            $('#task'+i).show();
        }else{
            $('#task'+i).hide();
        }
    }
}
// create a function to render icons when icon list change or move
function renderIcons(supercat_cursor, icons, idx){
    // redner TASK
    $('#question_panel'+idx).html('Task: select ' +'<div style="display:inline;color:blue">'+supercats[supercat_cursor]['name']+'</div>'+' items shown in the image (if any):')
    // clean icon panel
    cleanIconPanel(idx,icons);
    // icons panel
    for (i = 0; i<icons.length; i++){
        if (icons[i]['supercat_id'] == supercats[supercat_cursor].id){
    // drag and drop
            if (icons[i]['isselected'] == 0){
                var panel_idx = icons[i]['panel_idx'];
                icons[i]['div'].appendTo($('#div-candidate-icons_'+idx+'_'+panel_idx));
                icons[i]['div'].find('p').html(icons[i]['name']);
                icons[i]['div'].css('position', 'relative');
            }
        }
    }
}

function addIconListener(icons, idx){
    // set panel_idx
    var panel_idx_all = [];
    for (i=0;i<supercats.length; i++){
        panel_idx_all[supercats[i].id] = 0;
    }
    for (i = 0; i<icons.length; i++){
        icons[i]['idx'] = i;
        var scat_id = icons[i]['supercat_id'];
        icons[i]['panel_idx'] = panel_idx_all[scat_id];
        panel_idx_all[scat_id] += 1;
        // icon click event
        icons[i]['div'].bind('click',function(){
            var idx = $(this).data('idx');
            var img_idx = $(this).data('img_idx');

            var panel_idx = icons[idx]['panel_idx']
            var isselected = icons[idx]['isselected']
            // on the right panel
            if (isselected == 1 ){
                icons[idx]['isselected'] = 0;
                icons[idx]['div'].css('border-color', 'white');
                $(this).find('.caption').find('p').css('color', 'blue');
                icons[idx]['div1'].detach();
                // detach and append
                $(this).detach();
                if (icons[idx]['supercat_id'] == supercat_cursor[img_idx]+1){
                    $(this).appendTo($('#div-candidate-icons_'+img_idx+'_'+idx));
                }
                $(this).css('left', 0);
                $(this).css('top', 0);
                $(this).css('width', '50px');
                $(this).css('height', '50px');
                $(this).find('img').css('width', '50px');
                $(this).find('img').css('height', '50px');
                $(this).find('.icon').css('opacity', 1);
            }

            // re-render everything
            renderIcons(supercat_cursor[img_idx], icons_all[img_idx], img_idx);
        });
        icons[i]['div1'].bind('click',function(){
            var img_idx = $(this).data('img_idx');
            var idx = $(this).data('idx');
            icons[idx]['isselected'] = 0;
            icons[idx]['div'].css('border-color', 'white');
            icons[idx]['div'].find('.caption').find('p').css('color', 'blue');
            icons[idx]['div1'].detach();
            icons[idx]['div'].detach();
            if (icons[idx]['supercat_id'] == supercat_cursor[img_idx]+1){
                icons[idx]['div'].appendTo($('#div-candidate-icons_'+img_idx+'_'+idx));
            }
            icons[idx]['div'].css('left', 0);
            icons[idx]['div'].css('top', 0);
            icons[idx]['div'].css('width', '50px');
            icons[idx]['div'].css('height', '50px');
            icons[idx]['div'].find('img').css('width', '50px')
            icons[idx]['div'].find('img').css('height', '50px')
            // re-render everything
            renderIcons(supercat_cursor[img_idx], icons_all[img_idx], img_idx);

        });
        // mouse over event
        // change border of icons
        icons[i]['div'].mouseover( function(){
           var idx = $(this).data('idx');
            $(this).css('border-color', 'green');
            $(this).find('.caption').find('p').css('color', 'green');
        });
        icons[i]['div'].mouseout(function(){
            var idx = $(this).data('idx');
            var isselected = icons[idx]['isselected'];
            if (isselected == 0){
                var idx = $(this).data('idx');
                $(this).css('border-color', 'white');
                $(this).find('.caption').find('p').css('color', 'blue');
            }
        });
    }
}

function getAnswers(){
    var answers = [];
    for(i=0; i<icons_all.length; i++) {
        for (j = 0; j < icons_all[i].length; j++) {
            var icon = icons_all[i][j];
            if (icon['isselected'] == 1) {
                answers.push({
                    im_url: im_urls[i],
                    cat_id: icon['cat_id'],
                    cat_name: icon['name'],
                    x: icon['x'],
                    y: icon['y'],
                    drag_time: icon['drag_time']
                });
            }
        }
    }
    return answers;
}