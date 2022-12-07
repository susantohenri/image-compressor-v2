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

    wp_register_style('image-compressor-v2', "{$plugin_dir_url}image-compressor-v2.css?cache-breaker=" . time());
    wp_enqueue_style('image-compressor-v2');

	wp_register_script('image-compressor-v2', "{$plugin_dir_url}image-compressor-v2.js?cache-breaker=" . time());
    wp_enqueue_script('image-compressor-v2');

    return "
        <div class='image-compressor-v2'>
            <div class='custom_wrapper_two preview display-none'>
            </div>
            <div class='custom_wrapper_two loader display-none'>
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
            </div>
            <div class='custom_wrapper_two adjuster display-none'>
            </div>
        </div>
    ";
});
