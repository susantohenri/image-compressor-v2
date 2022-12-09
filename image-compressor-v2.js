window.onload = function () {
    var plugin_dir_url = jQuery('input[name="plugin_dir_url"]').val()
    var admin_ajax_url = jQuery('input[name="admin_ajax_url"]').val()

    var myDropzone = new Dropzone("#dropzone", {
        filesizeBase: 1024,
        maxThumbnailFilesize: 1000,
        clickable: '.image-compressor-v2 #uploadBtn',
        dictDefaultMessage: "<span style='cursor: default'>Drop your files here to upload</span>",
        renameFile: function (file) {
            var str = file.name
            str = str.replace(/\s+/g, '')
            file.name = str
            return str
        },
        init: function () {
            this.on("removedfile", file => {
                jQuery('.custom_wrapper.custom_wrapper_two').addClass('display-none')
                var errored = 0
                for (var i = this.files.length - 1; i >= 0; i--) {
                    if (this.files[i].status == 'error') {
                        errored++
                    }
                }
                if (this.files.length == 0 || errored == this.files.length) {
                    jQuery('#clearQBtn').addClass('disabled')
                    jQuery('#downloadAllBtn').addClass('disabled')
                }
            })
            this.on("addedfile", file => {
                file.previewElement.querySelector('[data-dz-name]').textContent = file.upload.filename
                for (node of file.previewElement.querySelectorAll("[data-dz-size]")) {
                    node.innerHTML = file.size
                }
            })
            this.on('success', function (file) {
                jQuery('#clearQBtn').removeClass('disabled')
                jQuery('#downloadAllBtn').removeClass('disabled')

                var img2source = plugin_dir_url + 'uploads'
                img2source += 'optimized' + file.upload.filename
                file.previewElement.addEventListener("click", previewFunc)
                registerBorderCss(file.previewElement)

                //make download button working
                var downloadButton = jQuery(file.previewElement).find('.download-link')
                downloadButton.on('click', function (e) {
                    e.preventDefault()
                    downloadURI(img2source + '?time=' + Math.floor(Date.now() / 1000), jQuery(file.previewElement).find('.dz-c-filename span').html())
                    downloadButton.off('click')
                })

                //show percentage of compression
                updateCompressionPercentage(img2source, file.previewElement)


                jQuery(file.previewElement).trigger('click')
                if (file.previewElement) {
                    jQuery(file.previewElement).find('.download-link').removeClass('display-none')
                    jQuery(file.previewElement).find('.loader').fadeOut()
                    return file.previewElement.classList.add("dz-success")
                }
            })
            this.on('uploadprogress', function (file, progress, bytesSent) {
                if (file.previewElement) {
                    for (let node of file.previewElement.querySelectorAll(
                        "[data-dz-uploadprogress]"
                    )) {
                        if (node.nodeName === "PROGRESS") {
                            (node.value = progress)
                        } else {
                            (node.style.width = `${progress}%`)
                        }
                        jQuery(node).parent().find('.upload-progress-percentage > strong').html(parseInt(progress) + '%')
                        if (progress == 100) {
                            jQuery(node).parent().fadeOut()
                            jQuery(node).parent().parent().append('<div class="loader"></div>').fadeIn()
                        }
                    }
                }
            })

            this.on('error', function (file, message) {
                console.log(file)
                jQuery("#clickPreventer").fadeOut()
                jQuery(file.previewElement).find('.loader').fadeOut()
                if (this.files.length > 20 /* maxFiles=20*/) {
                    if (file.previewElement) {
                        file.previewElement.remove()
                        this.files.pop()
                    }
                }
            })
        },
        maxFiles: 20,
        acceptedFiles: "image/jpeg, image/png, image/gif",
        // addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
    })

    jQuery('#clearQBtn').on('click', function () {
        myDropzone.removeAllFiles();
        // $('dz-preview').remove();
    });

    function getImageSize(URL) {
        return new Promise(function(resolve, reject) {
            console.log('url is: ' + URL);
            var dataToSend = {
                action: 'get_image_size',
                url: URL
            };
            $.ajax({
                type: "POST",
                url: admin_ajax_url,
                data: dataToSend,
                success: function(data) {
                    console.log("image size is: " + data)
                    resolve(data)
                },
                error: function(err) {
                    reject(err)
                }
            })
        })
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    function registerBorderCss(preview) {
        jQuery(preview).on('click', function () {
            jQuery('.dz-preview').each(function () {
                jQuery(this).removeClass('borderedPreview');
            })
            jQuery(this).addClass('borderedPreview')
        })
    }

    function previewFunc() {
        jQuery('.custom_wrapper_two').removeClass('display-none')

        if (this === window) {
            console.log('recompression')
        } else {
            console.log('first compression, here this is: ')
            console.log(this)
            lastPreviewElement = this
        }
        var filename = jQuery(lastPreviewElement).find('.dz-c-filename span').html()
        var img1source = plugin_dir_url + 'uploads/'
        img1source += filename
        var img2source = plugin_dir_url + 'uploads/'
        img2source += 'optimized' + filename

        var previewElementV = jQuery(lastPreviewElement)
        console.log('img1source is: ' + img1source + ' img2source: ' + img2source)
        //change image one
        console.log(jQuery('#container .img-comp-img img'))
        var afterImage = new Image()
        jQuery(afterImage).on('load', function () {
            console.log(afterImage)
            jQuery('#container .img-comp-img img').first().attr('src', this.src)
            updateCompressionPercentage(this.src, lastPreviewElement)
            var img2size = 0
            getImageSize(this.src).then(function (size) {
                img2size = formatBytes(size)
                var img2 = jQuery('#container .img-comp-img img').first()
                var newSize = 100 - parseFloat((100 * parseFloat(size)) / parseFloat(jQuery(lastPreviewElement).find('[data-dz-size]').html()))
                newSize = Number(newSize).toFixed(2)
                console.log('image 2 latest size is: ' + img2size)
                jQuery(lastPreviewElement).find('.percentage').html('-' + newSize + '%')
                jQuery(lastPreviewElement).data('image2Size', img2size)
                jQuery(lastPreviewElement).data('reducedPercentage', newSize)
                var image2Size = jQuery(lastPreviewElement).data('image2Size')
                jQuery('.text-after > strong').html('Compressed: ' + image2Size + ' (-' + jQuery(lastPreviewElement).data('reducedPercentage') + '%)')
                jQuery(afterImage).off('load')
            }).catch(function (err) {
                // Run this when promise was rejected via reject()
                console.log('error: ' + err)
            })


        })

        afterImage.src = img2source
        jQuery('#container .img-comp-img img').last().attr('src', img1source)
        var imgSize = jQuery(lastPreviewElement).find('.dz-size span').html()
        imgSize = formatBytes(imgSize)
        jQuery('.text-before > strong').html('Original: ' + imgSize)
    }

    function updateCompressionPercentage(img2source, previewElem) {
        var img2size = 0
        getImageSize(img2source).then(function(size) {
            img2size = formatBytes(size)
            var img2 = jQuery('#container .img-comp-img img').first()
            var newSize = 100 - parseFloat((100 * parseFloat(size)) / parseFloat(jQuery(previewElem).find('[data-dz-size]').html()))
            newSize = Number(newSize).toFixed(2)
            console.log('image 2 latest size is: ' + img2size)
            jQuery(previewElem).find('.percentage').html('-' + newSize + '%')
            jQuery(previewElem).data('image2Size', img2size)
            jQuery(previewElem).data('reducedPercentage', newSize)
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log('error: ' + err)
        })
    }
}