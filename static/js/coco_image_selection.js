// =============================================================================================
// initialize image grid from questions
// input: list of image urls one hope to display
// output: the variable "questions" to store image data and user response as a dictionary
// =============================================================================================
function initialize_grid(im_urls){
    // dynamically create image grid according to im_urls
    var data = new Array();
    for(i=0; i< im_urls.length; i++){
        data[i] = new Object();
        data[i]['div'] = $('<div class="div_grid_0"><img class="im_grid" src="'+im_urls[i]+'"></img></div>');
        data[i]['div'].data('src', im_urls[i]);
        data[i]['div'].data('idx', i);
        data[i]['img'] = $("<img src='"+ im_urls[i] +"' alt='Image preview' />")
        data[i]['isselected'] = 0;
        data[i]['div'].appendTo($('#imdiv'));

        // bind click event listener to detect if image is selected
        data[i]['div'].bind('click', function(){
            var idx = $(this).data('idx');
            var isselected = data[idx]['isselected'];
            if (isselected){
                $(this).attr('class', 'div_grid_0');
                data[idx]['isselected'] = 0;
            }else{
                $(this).attr('class', 'div_grid_1')
                data[idx]['isselected'] = 1;
            }
        });

    }
    imagePreview();
    return data;
}

// create a function to render icons when icon list change or move
function renderIcons(){
}


// ================================================================================================
// This script uses third party code for image hovering effect
// (see below information for details)
// ================================================================================================
/*
   url: http://jsfiddle.net/V5JCq/9/
*/

/*
 * Image preview script
 * powered by jQuery (http://www.jquery.com)
 *
 * written by Alen Grakalic (http://cssglobe.com)
 *
 * for more info visit http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery
 *
 */
function log(str, params) {
    var s = [str.length * 2];
    for (var i = 0; i < str.length; ++i) {
        s[i*2] = str[i];
        s[i*2 + 1] = params[i];
    }

    $("#log").val(s.join(""));
}

this.imagePreview = function(){
    /* CONFIG */
        xOffset = 15;
        yOffset = 30;

        // these 2 variable determine popup's distance from the cursor
        // you might want to adjust to get the right result
        var Mx = $(document).width();
        var My = $(document).height();

    /* END CONFIG */
    var callback = function(event) {
        var $img = $("#preview");

        // top-right corner coords' offset
        if (event.pageX<440){
            var trc_x = xOffset + $img.width();
            var trc_y = yOffset + $img.height();
        }else{
            var trc_x = -xOffset;
            var trc_y = yOffset + $img.height();
        }

        My = screen.height+$(window).scrollTop() -150
        trc_x = Math.min(trc_x + event.pageX, Mx);
        trc_y = Math.min(trc_y + event.pageY, My);

        log(
            ["[",";","](",";",") x: ", "; y: "],
            [Mx, My, event.pageX, event.pageY, trc_x, trc_y]);
        $img
            .css("top", (trc_y - $img.height()) + "px")
            .css("left", (trc_x - $img.width())+ "px");
        $img.show()
    };
   var callback_hover = function(event, modulus) {
        var $img = $("#preview");

        // top-right corner coords' offset
        if (modulus==0 || modulus==1){
            var trc_x = xOffset + $img.width();
            var trc_y = yOffset + $img.height();
        }else{
            var trc_x = -xOffset;
            var trc_y = yOffset + $img.height();
        }

        My = screen.height+$(window).scrollTop()-150
        trc_x = Math.min(trc_x + event.pageX, Mx);
        trc_y = Math.min(trc_y + event.pageY, My);

        log(
            ["[",";","](",";",") x: ", "; y: "],
            [Mx, My, event.pageX, event.pageY, trc_x, trc_y]);
        $img
            .css("top", (trc_y - $img.height()) + "px")
            .css("left", (trc_x - $img.width())+ "px");
    };

    $(".div_grid_0").hover(function(e){
            var idx = $(this).data('idx');
            Mx = $(document).width();
            My = $(document).height();
            My = screen.height+$(window).scrollTop() -150

            $("body").append("<p id='preview'></p>");
            $("#preview").hide();
            questions[idx]['img'].appendTo($('#preview'))
            var modulus = idx % 4;
            callback_hover(e, modulus);
            $("#preview").fadeIn("fast");
        },
        function(){
            $("#preview").remove();
        }
    )
    .mousemove(callback);
};