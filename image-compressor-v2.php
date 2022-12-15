<?php

/**
 * Image Compressor v2
 *
 * @package     ImageCompressonV2
 * @author      Henri Susanto
 * @copyright   2022 Henri Susanto
 * @license     GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: Image Compressor v2
 * Plugin URI:  https://github.com/susantohenri
 * Description: Compress images into smaller capacity
 * Version:     1.0.0
 * Author:      Henri Susanto
 * Author URI:  https://github.com/susantohenri
 * Text Domain: image-compressor-v2
 * License:     GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

add_shortcode('image-compressor-v2', function () {
    $plugin_dir_url = plugin_dir_url(__FILE__);

    wp_register_script('dropzone_script', 'https://unpkg.com/dropzone@5/dist/min/dropzone.min.js', array('jquery'));
    wp_enqueue_script('dropzone_script');

    wp_register_style('dropzone_style', 'https://unpkg.com/dropzone@5/dist/min/dropzone.min.css'/*, , ,$in_footer = false*/);
    wp_enqueue_style('dropzone_style');

    wp_register_style('fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'/*, , ,$in_footer = false*/);
    wp_enqueue_style('fontawesome');

    wp_register_script('vertical_range_slider', 'https://cdn.jsdelivr.net/npm/svelte-range-slider-pips@2.0.1/dist/svelte-range-slider-pips.js');
    wp_enqueue_script('vertical_range_slider');

    wp_register_script('images-compare', 'https://cdn.knightlab.com/libs/juxtapose/latest/js/juxtapose.min.js', array('jquery'), NULL, true);
    wp_enqueue_script('images-compare');

	wp_register_script('serializejson', plugin_dir_url(__FILE__) . 'serializejson.js', array('jquery'));
    wp_enqueue_script('serializejson');

	wp_register_style('images-compare-style', 'https://cdn.knightlab.com/libs/juxtapose/latest/css/juxtapose.css'/*, , ,$in_footer = false*/);
    wp_enqueue_style('images-compare-style');

    wp_register_style('image-compressor-v2', "{$plugin_dir_url}image-compressor-v2.css?cache-breaker=" . time());
    wp_enqueue_style('image-compressor-v2');

	wp_register_script('image-compressor-v2', "{$plugin_dir_url}image-compressor-v2.js?cache-breaker=" . time());
    wp_enqueue_script('image-compressor-v2');

    return "
        <div class='image-compressor-v2'>
            <script type='text/javascript'>
                Dropzone.autoDiscover = false;
            </script>
            <input type='hidden' name='plugin_dir_url' value=". plugin_dir_url(__FILE__) .">
            <input type='hidden' name='admin_ajax_url' value=". admin_url('admin-ajax.php') .">
            
            <div class='display-none' id='previewTemplate'>
                <div class='dz-preview dz-file-preview'>
                    <div class='dz-image'>
                        <div class='dz-c-filename'><span data-dz-name></span></div>
                        <img data-dz-thumbnail />
                        <div class='download-link-wrapper'>
                            <div class='download-link button display-none'><a href=''><i class='fa-solid fa-download'></i>Download</a></div>
                        </div>
                        <div class='percentage'></div>
                    </div>
                    <div class='dz-details'>
                        <div class='dz-size display-none'><span data-dz-size></span></div>
                    </div>
                    <div class='dz-progress'>
                        <span class='upload-progress-percentage'><strong></strong></span>
                        <span class='dz-upload' data-dz-uploadprogress></span>
                    </div>
                    <div class='dz-error-message'><span data-dz-errormessage></span></div>
                    <i data-dz-remove class='fa-solid fa-circle-xmark remove-icon'></i>
                    <div class='dz-success-mark'>
                        <svg width='54' height='54' viewBox='0 0 54 54' fill='white' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M10.2071 29.7929L14.2929 25.7071C14.6834 25.3166 15.3166 25.3166 15.7071 25.7071L21.2929 31.2929C21.6834 31.6834 22.3166 31.6834 22.7071 31.2929L38.2929 15.7071C38.6834 15.3166 39.3166 15.3166 39.7071 15.7071L43.7929 19.7929C44.1834 20.1834 44.1834 20.8166 43.7929 21.2071L22.7071 42.2929C22.3166 42.6834 21.6834 42.6834 21.2929 42.2929L10.2071 31.2071C9.81658 30.8166 9.81658 30.1834 10.2071 29.7929Z' />
                        </svg>
                    </div>
                    <div class='dz-error-mark'>
                        <svg width='54' height='54' viewBox='0 0 54 54' fill='white' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M26.2929 20.2929L19.2071 13.2071C18.8166 12.8166 18.1834 12.8166 17.7929 13.2071L13.2071 17.7929C12.8166 18.1834 12.8166 18.8166 13.2071 19.2071L20.2929 26.2929C20.6834 26.6834 20.6834 27.3166 20.2929 27.7071L13.2071 34.7929C12.8166 35.1834 12.8166 35.8166 13.2071 36.2071L17.7929 40.7929C18.1834 41.1834 18.8166 41.1834 19.2071 40.7929L26.2929 33.7071C26.6834 33.3166 27.3166 33.3166 27.7071 33.7071L34.7929 40.7929C35.1834 41.1834 35.8166 41.1834 36.2071 40.7929L40.7929 36.2071C41.1834 35.8166 41.1834 35.1834 40.7929 34.7929L33.7071 27.7071C33.3166 27.3166 33.3166 26.6834 33.7071 26.2929L40.7929 19.2071C41.1834 18.8166 41.1834 18.1834 40.7929 17.7929L36.2071 13.2071C35.8166 12.8166 35.1834 12.8166 34.7929 13.2071L27.7071 20.2929C27.3166 20.6834 26.6834 20.6834 26.2929 20.2929Z' />
                        </svg>
                    </div>
                </div>
            </div>

            <div class='custom_wrapper_two upload-box'>
                <div class='buttonWrapper'>
                    <div class='button' id='uploadBtn'>
                        <i class='fa-regular fa-circle-up'></i>&nbsp;Upload
                    </div>
                    <div class='button disabled' id='clearQBtn'><i class='fa-regular fa-circle-xmark'></i>&nbsp;Clear Queue</div>
                </div>
                <div class='custom_wrapper'>
                    <div class='scroll-button left'><i class='fa-solid fa-less-than'></i></div>
                    <form action='{$plugin_dir_url}upload.php' id='dropzone' class='dropzone'>
                    </form>
                    <div class='scroll-button right'><i class='fa-solid fa-greater-than'></i></div>
                </div>
                <div class='buttonWrapper'>
                    <div class='button disabled' id='downloadAllBtn'>
                        <i class='fa-regular fa-circle-down'></i>&nbsp;Download All
                    </div>
                </div>
            </div>
            <div class='custom_wrapper_two result display-none'>
                <div class='text-before'><strong></strong></div>
                <div class='text-after'><strong></strong></div>
            </div>
            <div class='custom_wrapper_two adjuster display-none'>
                <div id='container' class='img-comp-container'>
                    <div class='img-comp-img'>
                        <img class='image' src='{$plugin_dir_url}giphy.gif'>
                    </div>
                    <div class='img-comp-img img-comp-overlay'>
                        <img class='image' src='{$plugin_dir_url}giphy2.gif'>
                    </div>
                </div>
                <div id='quality_range'>
                    <form id='quality_form'>
                        <div id='quality_value_wrapper'>
                            <span>Compression</span>
                            <div name='quality' id='value_in_number'>80</div>
                        </div>
                        <input type='hidden' value='' name='originalfilename'>
                        <input type='hidden' value='' name='optimizedfilename'>
                        <div id='my-slider' class='slider'>
                            <input class='button' type='button' value='Apply' name='submit' id='quality_form_submit'>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    ";
});
