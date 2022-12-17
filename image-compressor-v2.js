window.onload = function () {
    var plugin_dir_url = jQuery('input[name="plugin_dir_url"]').val()
    var admin_ajax_url = jQuery('input[name="admin_ajax_url"]').val()

    let slider = new juxtapose.JXSlider('#JXSlider',
        [
            {
                src: plugin_dir_url + 'uploads/bg_auth.jpg',
            },
            {
                src: plugin_dir_url + 'uploads/bg_auth.jpg',
            }
        ],
        {
            animate: true,
            showLabels: true,
            showCredits: true,
            startingPosition: "50%",
            makeResponsive: true
        }
    )

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
        jQuery('#value_in_number').html(e.detail.value)
    })

    var myDropzone = new Dropzone("#dropzone", {
        previewTemplate: jQuery('#previewTemplate').html(),
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

                var img2source = plugin_dir_url + 'uploads/'
                img2source += 'optimized' + file.upload.filename
                file.previewElement.addEventListener("click", previewFunc)
                registerBorderCss(file.previewElement)

                var downloadButton = jQuery(file.previewElement).find('.download-link')
                downloadButton.on('click', function (e) {
                    e.preventDefault()
                    downloadURI(img2source + '?time=' + Math.floor(Date.now() / 1000), jQuery(file.previewElement).find('.dz-c-filename span').html())
                    downloadButton.off('click')
                })

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
        myDropzone.removeAllFiles()
        // $('dz-preview').remove();
    });

    function downloadURI(uri, name) {
        var link = document.createElement("a")
        link.setAttribute('download', name)
        link.href = uri
        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    jQuery('#downloadAllBtn').on('click', function (e) {
        e.preventDefault()
        var links = []
        for (var i = myDropzone.files.length - 1; i >= 0; i--) {
            if (myDropzone.files[i].status == "success") {
                links.push('optimized' + myDropzone.files[i].name)
            }
        }
        
        var dataToSend = {}
        dataToSend['files'] = links
        dataToSend['action'] = 'download_all_button'
        
        jQuery.ajax({
            url: admin_ajax_url,
            data: dataToSend,
            type: 'POST',
            success: function (data) {
                downloadURI(data, 'compressedImages.zip')
            },
            failure: function (data) { },
            error: function (data) { }
        })
    })

    function getImageSize(URL) {
        return new Promise(function (resolve, reject) {
            var dataToSend = {
                action: 'get_image_size',
                url: URL
            };
            jQuery.ajax({
                type: "POST",
                url: admin_ajax_url,
                data: dataToSend,
                success: function (data) {
                    console.log("image size is: " + data)
                    resolve(data)
                },
                error: function (err) {
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
            // console.log('recompression')
        } else {
            lastPreviewElement = this
        }

        var filename = jQuery(lastPreviewElement).find('.dz-c-filename span').html()
        var img1source = plugin_dir_url + 'uploads/' + filename
        var img2source = plugin_dir_url + 'uploads/' + 'optimized' + filename

        var previewElementV = jQuery(lastPreviewElement)
        var afterImage = new Image()
        jQuery(afterImage).on('load', function () {
            jQuery('#container .img-comp-img img').first().attr('src', this.src)
            updateCompressionPercentage(this.src, lastPreviewElement)
            var img2size = 0
            getImageSize(this.src).then(function (size) {
                img2size = formatBytes(size)
                var img2 = jQuery('#container .img-comp-img img').first()
                var newSize = 100 - parseFloat((100 * parseFloat(size)) / parseFloat(jQuery(lastPreviewElement).find('[data-dz-size]').html()))
                newSize = Number(newSize).toFixed(2)
                jQuery(lastPreviewElement).find('.percentage').html('-' + newSize + '%')
                jQuery(lastPreviewElement).data('image2Size', img2size)
                jQuery(lastPreviewElement).data('reducedPercentage', newSize)
                var image2Size = jQuery(lastPreviewElement).data('image2Size')
                jQuery('.text-after > strong').html('Compressed: ' + image2Size + ' (-' + jQuery(lastPreviewElement).data('reducedPercentage') + '%)')
                jQuery(afterImage).off('load')
            }).catch(function (err) {
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
        getImageSize(img2source).then(function (size) {
            img2size = formatBytes(size)
            var img2 = jQuery('#container .img-comp-img img').first()
            var newSize = 100 - parseFloat((100 * parseFloat(size)) / parseFloat(jQuery(previewElem).find('[data-dz-size]').html()))
            newSize = Number(newSize).toFixed(2)
            console.log('image 2 latest size is: ' + img2size)
            jQuery(previewElem).find('.percentage').html('-' + newSize + '%')
            jQuery(previewElem).data('image2Size', img2size)
            jQuery(previewElem).data('reducedPercentage', newSize)
        }).catch(function (err) {
            console.log('error: ' + err)
        })
    }

    jQuery('#quality_form_submit').on('click', function(e) {
        e.preventDefault()
        // jQuery('#clickPreventer').fadeIn()
        var dataToSend = {}
        var optimizedfilename = plugin_dir_url + 'uploads/optimizedbg_auth.jpg'
        var originalfilename = plugin_dir_url + 'uploads/bg_auth.jpg'
        dataToSend['action'] = 'quality_change_of_picture'
        dataToSend['quality'] = jQuery('#value_in_number').html()
        dataToSend['originalfilename'] = originalfilename
        dataToSend['optimizedfilename'] = optimizedfilename

        recompress(dataToSend).then(function(data) {
            console.log(data)
            previewFunc()
            // jQuery('#clickPreventer').fadeOut()
        }).catch(function(err) {
            // alert("error")
            console.log(err)
            // jQuery('#clickPreventer').fadeOut()
        })

    })

    function recompress(dataToSend) {
        return new Promise(function(resolve, reject) {
            jQuery.ajax({
                url: admin_ajax_url,
                data: dataToSend,
                type: 'POST',
                success: function(data) {
                    resolve(data)
                },
                error: function(err) {
                    reject(err)
                }
            });
        });
    }
}