jQuery(document).ready(function ($) {
    jQuery('.image').on('dragstart', function (e) {
        e.preventDefault();
    });
    function enableDragOnContainer() {
        const ele = document.getElementById('container');
        ele.style.cursor = 'grab';

        let pos = { top: 0, left: 0, x: 0, y: 0 };

        const mouseDownHandler = function (e) {
            ele.style.cursor = 'grabbing';
            ele.style.userSelect = 'none';

            pos = {
                left: ele.scrollLeft,
                top: ele.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };


            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };

        const mouseMoveHandler = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;

            // Scroll the element
            ele.scrollTop = pos.top - dy;
            ele.scrollLeft = pos.left - dx;


        };

        const mouseUpHandler = function (e) {
            ele.style.cursor = 'grab';
            ele.style.removeProperty('user-select');
            // console.log(getCursorPos2(e));
            img.style.width = getCursorPos2(e) + "px";
            $(img).data('slided', 'true');
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        ele.addEventListener('mousedown', mouseDownHandler);
    }

    enableDragOnContainer();



    var slider, img, clicked = 0, w, h;
    img = document.getElementsByClassName("img-comp-overlay")[0];
    function initComparisons() {
        /* Once for each "overlay" element:
        pass the "overlay" element as a parameter when executing the compareImages function: */
        compareImages(img);
    }
    function slideReady(e) {
        /* Prevent any other actions that may occur when moving over the image: */
        e.preventDefault();
        /* The slider is now clicked and ready to move: */
        clicked = 1;
        /* Execute a function when the slider is moved: */
        window.addEventListener("mousemove", slideMove);
        window.addEventListener("touchmove", slideMove);
    }
    function slideFinish() {
        /* The slider is no longer clicked: */
        clicked = 0;
    }
    function slideMove(e) {
        var pos;
        /* If the slider is no longer clicked, exit this function: */
        if (clicked == 0) return false;
        /* Get the cursor's x position: */
        pos = getCursorPos(e)
        /* Prevent the slider from being positioned outside the image: */
        // console.log($('#container')[0].getBoundingClientRect());
        // console.log(window.pageXOffset+' '+$('#container').left+' '+$('#container').right+' '+w);
        // console.log('container offsetWidth is: '+$('#container')[0].offsetWidth);
        if (pos < 0) pos = 0;
        if (pos > $('#container')[0].offsetWidth) pos = $('#container')[0].offsetWidth;
        /* Execute a function that will resize the overlay image according to the cursor: */
        // console.log('pos in slide is: '+pos+' slider.offsetWidth:'+slider.offsetWidth+' imgOffsetWidth: '+img.offsetWidth);
        /* Resize the image: */
        // console.log($(slider));
        img.style.width = pos + $('#container')[0].scrollLeft /*(sliderWidth/2)*/ + "px";
        /* Position the slider: */
        slider.style.left = parseFloat(img.offsetWidth - $('#container')[0].scrollLeft + 20) + 'px';
        if (Number(slider.style.left.replace('px', '')) < 0) slider.style.left = 0 + 'px';
    }
    function getCursorPos(e) {
        var a, x = 0;
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        /* Get the x positions of the image: */
        a = $('#container')[0].getBoundingClientRect();
        /* Calculate the cursor's x coordinate, relative to the image: */
        // console.log($('#container'));
        // console.log('e.pageX:'+e.pageX+" a.left"+a.left+" $('#container')[0]scrollLeft"+$('#container')[0].scrollLeft);
        x = e.pageX - a.left;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset/* - $('#container')[0].scrollLeft*/;
        return x;
    }
    function getCursorPos2(e) {
        var a, x = 0;
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        /* Get the x positions of the image: */
        a = $('#container').scrollLeft();
        b = $('.img-comp-slider')[0].getBoundingClientRect();
        /* Calculate the cursor's x coordinate, relative to the image: */
        // console.log($('#container')[0].getBoundingClientRect());
        // console.log(window.pageXOffset+' '+$('#container').left+' '+$('#container').right+' '+b.left+' '+b.right);

        x = e.pageX - a.left;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        return Number(a + parseFloat(b.left + b.right) / 2) - window.pageXOffset - $('#container')[0].getBoundingClientRect().left;
        return x;
    }
    function slide(x) {

    }
    function compareImages(img) {
        /* Get the width and height of the img element */
        w = img.offsetWidth;
        h = img.offsetHeight;
        /* Set the width of the img element to 50%: */
        img.style.width = ($('#container')[0].offsetWidth / 2) - 20 + "px";
        /* Create slider: */
        slider = document.createElement("DIV");
        slider.setAttribute("class", "img-comp-slider");
        var handle = document.createElement('I');
        handle.setAttribute('class', 'fa-solid fa-left-right slider-handle');
        slider.appendChild(handle);
        /* Insert slider */
        $('#container').parent().prepend(slider);
        // img.parentElement.insertBefore(slider, img.parentElement);
        /* Position the slider in the middle: */
        // console.log($('#container')[0].offsetHeight);
        $('div.custom_wrapper.custom_wrapper_two.display-none').attr("style", "display:flex!important");
        // alert($('#container')[0].offsetWidth);
        // slider.style.top = ($('#container')[0].offsetHeight / 2) - (slider.offsetHeight / 2) + "px";
        slider.style.left = ($('#container')[0].offsetWidth / 2) - (slider.offsetWidth / 2) + "px";
        $('div.custom_wrapper.custom_wrapper_two.display-none').attr("style", "");

        /* Execute a function when the mouse button is pressed: */
        slider.addEventListener("mousedown", slideReady);
        /* And another function when the mouse button is released: */
        window.addEventListener("mouseup", slideFinish);
        /* Or touched (for touch screens: */
        slider.addEventListener("touchstart", slideReady);
        /* And released (for touch screens: */
        window.addEventListener("touchend", slideFinish);
    }
    initComparisons();
})

var mySlider = new RangeSliderPips({
    target: document.querySelector("#my-slider"),
    props: {
        min: 1,
        max: 100,
        vertical: true,
        values: [80],
        float: true,
    }
});

mySlider.$on('change', function (e) {
    jQuery('#value_in_number').html(e.detail.value);
});

jQuery(document).ready(function ($) {
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        // If you don't know the name or want to use
        // the webserver default set name = ''
        link.setAttribute('download', name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
    var ajaxurl = "https://localhost/wordpress/wp-admin/admin-ajax.php";

    function getImageSize(URL) {
        return new Promise(function (resolve, reject) {
            console.log('url is: ' + URL);
            var dataToSend = {
                action: 'get_image_size',
                url: URL
            };
            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: dataToSend,
                success: function (data) {
                    console.log("image size is: " + data);
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    function updateCompressionPercentage(img2source, previewElem) {
        var img2size = 0;
        getImageSize(img2source).then(function (size) {
            img2size = formatBytes(size);
            var img2 = $('#container .img-comp-img img').first();
            var newSize = 100 - parseFloat((100 * parseFloat(size)) / parseFloat($(previewElem).find('[data-dz-size]').html()));
            newSize = Number(newSize).toFixed(2);
            console.log('image 2 latest size is: ' + img2size);
            $(previewElem).find('.percentage').html('-' + newSize + '%');
            $(previewElem).data('image2Size', img2size);
            $(previewElem).data('reducedPercentage', newSize);
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log('error: ' + err);
        })
    }
    var myDropzone = new Dropzone("#dropzone", {
        previewTemplate: document.getElementById('previewTemplate').innerHTML,
        filesizeBase: 1024,
        maxThumbnailFilesize: 1000,
        clickable: '#uploadBtn',
        dictDefaultMessage: "<span style='cursor: default;'>Drop your files here to upload</span>",
        renameFile: function (file) {
            var str = file.name;
            str = str.replace(/\s+/g, '');
            file.name = str;
            console.log('old filename: ' + file.name + ' new filename: ' + str);
            return str;
        },
        init: function () {
            var $dzElem = this;
            this.on("removedfile", file => {
                $('.custom_wrapper.custom_wrapper_two').addClass('display-none');
                var errored = 0;
                for (var i = this.files.length - 1; i >= 0; i--) {
                    if (this.files[i].status == 'error') {
                        errored++;
                    }
                }
                if (this.files.length == 0 || errored == this.files.length) {
                    $('#clearQBtn').addClass('disabled');
                    $('#downloadAllBtn').addClass('disabled');
                }
            });
            this.on("addedfile", file => {
                file.previewElement.querySelector('[data-dz-name]').textContent = file.upload.filename;
                for (node of file.previewElement.querySelectorAll("[data-dz-size]")) {
                    node.innerHTML = file.size;
                }
            });
            this.on('success', function (file) {
                $('#clearQBtn').removeClass('disabled');
                $('#downloadAllBtn').removeClass('disabled');

                var img2source = '<? echo plugin_dir_url(__FILE__) . "uploads/"; ?>';
                img2source += 'optimized' + file.upload.filename;
                file.previewElement.addEventListener("click", previewFunc);
                registerBorderCss(file.previewElement);

                //make download button working
                var downloadButton = $(file.previewElement).find('.download-link');
                downloadButton.on('click', function (e) {
                    e.preventDefault();
                    downloadURI(img2source + '?time=' + Math.floor(Date.now() / 1000), $(file.previewElement).find('.dz-c-filename span').html());
                    downloadButton.off('click');
                });

                //show percentage of compression;
                updateCompressionPercentage(img2source, file.previewElement);


                $(file.previewElement).trigger('click');
                if (file.previewElement) {
                    $(file.previewElement).find('.download-link').removeClass('display-none');
                    $(file.previewElement).find('.loader').fadeOut();
                    return file.previewElement.classList.add("dz-success");
                }
            });
            this.on('uploadprogress', function (file, progress, bytesSent) {
                console.log(progress);
                if (file.previewElement) {
                    for (let node of file.previewElement.querySelectorAll(
                        "[data-dz-uploadprogress]"
                    )) {
                        if (node.nodeName === "PROGRESS") {
                            (node.value = progress);
                        } else {
                            (node.style.width = `${progress}%`);
                        }
                        $(node).parent().find('.upload-progress-percentage > strong').html(parseInt(progress) + '%');
                        if (progress == 100) {
                            $(node).parent().fadeOut();
                            $(node).parent().parent().append('<div class="loader"></div>').fadeIn();
                        }
                    }
                }
            });

            this.on('error', function (file, message) {
                $("#clickPreventer").fadeOut();
                $(file.previewElement).find('.loader').fadeOut();
                if (this.files.length > 20 /* maxFiles=20*/) {
                    if (file.previewElement) {
                        file.previewElement.remove();
                        this.files.pop();
                    }
                }
            })
        },
        maxFiles: 20,
        acceptedFiles: "image/jpeg, image/png, image/gif",
        // addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
    });
    // $('.vranger').on('change', function(){
    // 	$('#quality_form_submit').trigger('click');
    // });
    $('.scroll-button').on('click', function () {
        //commented out part is for snapping to item;
        var container = $(this).parent().find('form');
        // container.css('scroll-snap-type', 'none');
        var dir = $(this).hasClass('left') ? '-=' : '+=';
        container.stop().animate({
            scrollLeft: dir + container[0].offsetWidth
        }, 500 /*, ()=> container.css('scroll-snap-type', 'none')*/);
    });

    function recompress(dataToSend) {
        return new Promise(function (resolve, reject) {
            console.log(dataToSend);
            $.ajax({
                url: ajaxurl,
                data: dataToSend,
                type: 'POST',
                success: function (data) {
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }
    var lastPreviewElement = '';
    $('#quality_form_submit').on('click', function (e) {
        e.preventDefault();
        $('#clickPreventer').fadeIn();
        var dataToSend = {};
        var optimizedfilename = $('#container .img-comp-img img').first()[0].src;
        var originalfilename = optimizedfilename.replace('optimized', '');
        dataToSend['action'] = 'quality_change_of_picture';
        dataToSend['quality'] = $('#value_in_number').html();
        dataToSend['originalfilename'] = originalfilename;
        dataToSend['optimizedfilename'] = optimizedfilename;
        recompress(dataToSend).then(function (data) {
            console.log(data);
            previewFunc();
            $('#clickPreventer').fadeOut();
        }).catch(function (err) {
            alert("error");
            console.log(err);
            $('#clickPreventer').fadeOut();
        });

    });
    $('#clearQBtn').on('click', function () {
        myDropzone.removeAllFiles();
        // $('dz-preview').remove();
    });

    $('#downloadAllBtn').on('click', function (e) {
        e.preventDefault();
        var links = [];
        for (var i = myDropzone.files.length - 1; i >= 0; i--) {
            if (myDropzone.files[i].status == "success") {
                links.push('optimized' + myDropzone.files[i].name);
            }
        }
        // console.log(links);
        var dataToSend = {};
        dataToSend['files'] = links;
        dataToSend['action'] = 'download_all_button';
        console.log(dataToSend);
        $.ajax({
            url: ajaxurl,
            data: dataToSend,
            type: 'POST',
            success: function (data) {
                console.log(data);
                downloadURI(data, 'compressedImages.zip');
            },
            failure: function (data) { },
            error: function (data) { }
        })
    });

    function registerBorderCss(preview) {
        $(preview).on('click', function () {
            $('.dz-preview').each(function () {
                $(this).removeClass('borderedPreview');
            });
            $(this).addClass('borderedPreview');
        });
    }

    function previewFunc() {
        $('.custom_wrapper.custom_wrapper_two').removeClass('display-none');

        if (this === window) {
            console.log('recompression');
        } else {
            console.log('first compression, here this is: ');
            console.log(this);
            lastPreviewElement = this;
        }
        var filename = $(lastPreviewElement).find('.dz-c-filename span').html();
        var img1source = '<? echo plugin_dir_url(__FILE__) . "uploads/"; ?>';
        img1source += filename;
        var img2source = '<? echo plugin_dir_url(__FILE__) . "uploads/"; ?>';
        img2source += 'optimized' + filename;

        var previewElementV = $(lastPreviewElement);
        console.log('img1source is: ' + img1source + ' img2source: ' + img2source);
        //change image one
        console.log($('#container .img-comp-img img'));
        var afterImage = new Image();
        $(afterImage).on('load', function () {
            console.log(afterImage);
            $('#container .img-comp-img img').first().attr('src', this.src);
            updateCompressionPercentage(this.src, lastPreviewElement);
            var img2size = 0;
            getImageSize(this.src).then(function (size) {
                img2size = formatBytes(size);
                var img2 = $('#container .img-comp-img img').first();
                var newSize = 100 - parseFloat((100 * parseFloat(size)) / parseFloat($(lastPreviewElement).find('[data-dz-size]').html()));
                newSize = Number(newSize).toFixed(2);
                console.log('image 2 latest size is: ' + img2size);
                $(lastPreviewElement).find('.percentage').html('-' + newSize + '%');
                $(lastPreviewElement).data('image2Size', img2size);
                $(lastPreviewElement).data('reducedPercentage', newSize);
                var image2Size = $(lastPreviewElement).data('image2Size');
                $('.text-after > strong').html('Compressed: ' + image2Size + ' (-' + $(lastPreviewElement).data('reducedPercentage') + '%)');
                $(afterImage).off('load');
            }).catch(function (err) {
                // Run this when promise was rejected via reject()
                console.log('error: ' + err);
            })
        })

        afterImage.src = img2source;
        $('#container .img-comp-img img').last().attr('src', img1source);
        var imgSize = $(lastPreviewElement).find('.dz-size span').html();
        imgSize = formatBytes(imgSize);
        $('.text-before > strong').html('Original: ' + imgSize);
    }

});
