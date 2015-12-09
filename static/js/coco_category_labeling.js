function initialize_anncats(){
    N = supercats.length;
    var im = [];
    for (i=0;i<im_urls.length;i++){
        url = im_urls[i];
        imdiv = $('#imdiv'+i);
        // image to be annotated
        im[i] = $('<div class="div-image"><img class="image-task" src="'+url+'"></img></div>');
        im[i].children().data('i',i);
        im[i].appendTo(imdiv);
        // ====================================================
        // prepare images after load image
        // =====================================================
        im[i].children().load(function(){
            // ====================================================
            // adapt to the scale of image
            // =====================================================
            console.log($(this).css('width'))
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
            //================================================================================
            // add next and previous buttons
            //================================================================================
            button_next = $('<img id="button-next'+i+'" class="img-button" src="static/img/icons/right.png"></img>');
            button_next.bind('click', function(){
                nextTask();
            });
            button_panel_right.hover( function(){ $(this).find('img').attr('src', "static/img/icons/right_green.png")},
                                      function(){ $(this).find('img').attr('src', "static/img/icons/right.png")});

            button_prev = $('<img id="button-prev'+i+'" class="img-button" src="static/img/icons/left.png"></img>');
            button_prev.bind('click', function(){
                prevTask();
            });
            button_panel_left.hover( function(){ $(this).find('img').attr('src', "static/img/icons/left_green.png")},
                                      function(){ $(this).find('img').attr('src', "static/img/icons/left.png")});
            button_next.appendTo(button_panel_right);
            button_prev.appendTo(button_panel_left);
            //==================================================
            // add progress bar
            //==================================================
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
            progressbar.height(20);
            progressbar.width(690);
            // progress number
            $('#progress-number'+i).html('1/'+N);
            //==================================================
            // render icons
            //==================================================
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
// =========================================
// ============ key press listener =========
// =========================================
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
//        if (task_cursor >0){
//            task_cursor -= 1;
//            renderTask();
//        }
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
    //clean icon panel
    cleanIconPanel(idx,icons);
    //icons panel
    for (i = 0; i<icons.length; i++){
        if (icons[i]['supercat_id'] == supercats[supercat_cursor].id){
// ============== drag and drop ===============================================
            if (icons[i]['isselected'] == 0){
                var panel_idx = icons[i]['panel_idx'];
                icons[i]['div'].appendTo($('#div-candidate-icons_'+idx+'_'+panel_idx));
                icons[i]['div'].find('p').html(icons[i]['name']);
                icons[i]['div'].css('position', 'relative');
            }
// ============== no drag and drop ============================================
//            var panel_idx = icons[i]['panel_idx'];
//            icons[i]['div'].appendTo($('#div-candidate-icons_'+idx+'_'+panel_idx));
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
        // ===========================================================
        // ============== icon click event ==========================
        // ===========================================================
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

            // on the bottom panel
            }else{
//                icons[idx]['div1'].appendTo($('#cats_icons'+img_idx));
//                icons[idx]['div'].css('border-color', 'green');
//                $(this).find('.caption').find('p').css('color', 'green');
//                icons[idx]['div1'].css('border-color', 'green');
//                icons[idx]['isselected'] = 1;
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
