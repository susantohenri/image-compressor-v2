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
            <input type='text' name='plugin_dir_url' value=". plugin_dir_url(__FILE__) ." class='display-none'>
            <input type='text' name='admin_ajax_url' value=". admin_url('admin-ajax.php') ." class='display-none'>
            
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
