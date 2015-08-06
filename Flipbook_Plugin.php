<?php


include_once('Flipbook_LifeCycle.php');

class Flipbook_Plugin extends Flipbook_LifeCycle {

    /**
     * See: http://plugin.michael-simpson.com/?page_id=31
     * @return array of option meta data.
     */
    public function getOptionMetaData() {
        return array(
            //'_version' => array('Installed Version'), // Leave this one commented-out. Uncomment to test upgrades.
        );
    }

//    protected function getOptionValueI18nString($optionValue) {
//        $i18nValue = parent::getOptionValueI18nString($optionValue);
//        return $i18nValue;
//    }

    protected function initOptions() {
        $options = $this->getOptionMetaData();
        if (!empty($options)) {
            foreach ($options as $key => $arr) {
                if (is_array($arr) && count($arr > 1)) {
                    $this->addOption($key, $arr[1]);
                }
            }
        }
    }

    public function getPluginDisplayName() {
        return 'Flipbook';
    }

    protected function getMainPluginFileName() {
        return 'flipbook.php';
    }

    /**
     * See: http://plugin.michael-simpson.com/?page_id=101
     * Called by install() to create any database tables if needed.
     * Best Practice:
     * (1) Prefix all table names with $wpdb->prefix
     * (2) make table names lower case only
     * @return void
     */
    protected function installDatabaseTables() {
        //        global $wpdb;
        //        $tableName = $this->prefixTableName('mytable');
        //        $wpdb->query("CREATE TABLE IF NOT EXISTS `$tableName` (
        //            `id` INTEGER NOT NULL");
    }

    /**
     * See: http://plugin.michael-simpson.com/?page_id=101
     * Drop plugin-created tables on uninstall.
     * @return void
     */
    protected function unInstallDatabaseTables() {
        //        global $wpdb;
        //        $tableName = $this->prefixTableName('mytable');
        //        $wpdb->query("DROP TABLE IF EXISTS `$tableName`");
    }


    /**
     * Perform actions when upgrading from version X to version Y
     * See: http://plugin.michael-simpson.com/?page_id=35
     * @return void
     */
    public function upgrade() {
    }


    public function create_posttype() {
        register_post_type( 'publications',
        // CPT Options
            array(
                'labels' => array(
                    'name' => __( 'Publication' ),
                    'singular_name' => __( 'Publication' ),
                    'add_new' => "Add New PDF Publication",
                    'add_new_item' => 'Add New PDF Publication',
                    'edit_item' => 'Edit PDF Publication',
                    'search_items' => 'Search PDF Publications',
                    'not_found' => 'No PDF Publications Found',
                    'view_item' => 'View PDF Publication',
                    'not_found_in_trash' => 'No PDF Publications Found in Trash'
                    ),
                'public' => true,
                'has_archive' => true,
                'supports' => array('title','author','thumbnail','excerpt'),
                'rewrite' => false,
                'public' => true,
                'menu_icon' => plugins_url('images/book.png', __FILE__) ,
                'capability_type' => 'post',
                'hierarchical' => false,
                'publicly_queryable' => true,
                'has_archive' => false
            )
        );

        add_shortcode( 'flipbook', array(&$this, 'add_s'));
        add_shortcode( 'shelf', array(&$this, 'add_flipbook_shelf'));

    }

    //Remove sidebar

    public function remove_sidebar(){
        $registered_sidebars = wp_get_sidebars_widgets();
        foreach( $registered_sidebars as $sidebar_name => $sidebar_widgets ) {
            if( $sidebar_name != 'wp_inactive_widgets' ) unregister_sidebar( $sidebar_name );
        }
    }

    //Add shelf shortcode 
    public function add_flipbook_shelf(){
        $args = array( 'post_type' => 'publications', 'posts_per_page' => -1 );
        $loop = new WP_Query( $args );

    ?>
        <!-- Page Content -->
<div class="wrapper">

        <div id="three-columns" class="grid-container" style="display:block;">
            <ul class="rig columns-3">

    <?php

        while ( $loop->have_posts() ) : $loop->the_post();
            $postid = get_the_ID();
            $web_loader_path = plugins_url("js/pdf.worker.js", __FILE__);
            $alink = get_post_type_archive_link('lp_publication');
            $current_post_id = get_the_ID();
            $post_title = get_the_title();
            $excerpt = get_the_excerpt();
            $pdf_worker_path = plugins_url("js/pdf.worker.js", __FILE__);
            $uploaded_pdf = get_post_meta($current_post_id, 'pdf_file_attachment', true );
            

            $current_post_id = get_the_ID(); 
            $uploaded_thumbnail = get_post_meta( $current_post_id, 'wp_flipbook_thumbnail', true );

            if(isset($uploaded_thumbnail['url'])){
                $thumbnail_path = $uploaded_thumbnail['url'];
            }else{
                $thumbnail_path = plugins_url("images/placeholder.jpg", __FILE__);
            }

            $wp_name = basename( $thumbnail_path);

       
            if(empty($post_title)){
                $post_title = "No title";
            }

            if(empty($excerpt)){
                $excerpt = "No Description";
            }
    ?>

        <li>
            <a  href="<?php the_permalink(); ?>">
                <img class="img-responsive" width="100%" height="100%" src="<?php echo $thumbnail_path; ?>" alt="">
            </a>
            <p> <a href="<?php the_permalink(); ?>"><?php echo wp_trim_words($post_title,10,"Read more"); ?></a></p>
        </li>
       
    <?php 
        endwhile;
        wp_reset_query();
    ?>
                </ul>
        </div>
</div>

    <?php
    }

    //Add shortcode $atts is the parameter given to the shortcode 
    public function add_s($atts){
        if(is_archive())
            $pdf_worker_path = plugins_url("js/pdf.worker.js", __FILE__);
            $id = $atts['id'];
            $pdf_path_url = get_post_meta($id, 'pdf_file_attachment', true );

            $uploaded_thumbnail = get_post_meta($id, 'wp_flipbook_thumbnail', true );
            if(isset($uploaded_thumbnail['url'])){
                $thumbnail_path = $uploaded_thumbnail['url'];
            }else{
                 $thumbnail_path = plugins_url("images/placeholder.jpg", __FILE__);
            }
    ?>

        <a id="thumbnail"  href="<?php echo get_permalink($id);?>" >
            <div class="thumbnail-play">
                <img  width="100%" height="100%" src="<?php echo $thumbnail_path; ?>">
            </div>
        </a>

        <script type="text/javascript">
            jQuery(function () {
                    jQuery('.popup-modal').magnificPopup({
                        type: 'inline',
                        preloader: true,
                        focus: '#flipbook_popup',
                        modal: true,
                        closeBtnInside: false,
                        callbacks: {
                            open: function(){
                                $ = jQuery;
                                PDFJS.workerSrc = "<?php echo($pdf_worker_path); ?>";
                                webViewerInitialized("<?php echo($pdf_path_url); ?>");
                                 $('html').css('overflow','hidden');
                            },
                            close: function(){
                                 jQuery('html').css('overflow','scroll');

                            }
                        }
                    });
                    
                });
        </script>
    <?php
    }

    //Add javascript code to the footer for each of the publication 
    public function add_lightbox_script(){ 
        $postid = get_the_ID();

        if ( get_post_type( $postid ) != 'publications' || is_archive()) {
            ?>
            <div  id="flipbook-popup" class="mfp-hide"> 
             <div id="flipbook_popup" style='position:fixed; overflow:hidden; width:100%; height:100%; background-color:blue; display:block; top:0; left:0;z-index:1000'> 
                        <div id='flipbook' style=" overflow:hidden; width:100%; height:100%; background-color:rgba(0,0,0,0.9); position:absolute; top:0;left:0;bottom:0;right:0;"> 
                                <div id="lp"  style="position:absolute; overflow:hidden; height:100%; width:100%; top: 0; left:0; bottom:0;  right: 0;margin:auto">
                                    <div id="nextbtn"></div>
                                    <div id="prevbtn"> </div>
                                    <div id="thumbnails">
                                    <div id="faulu" class="thumbnails-nav">
                                    <div id="current-nav" class="thumbnails-nav-current">
                                    <div id="next_lp" class="thumbnails-nav-next thumbnail-final"> <div id="next-thumbnail" class="inner_thumbnail"> <div id="next_hover" class="mouse_out_thumbnail"></div> <div id="next-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="next-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                                    <div  id="prev-flipbook_popup" class="thumbnails-nav-prev thumbnail-final"> <div id="prev-thumbnail" class="inner_thumbnail"> <div id="prev-flipbook_popup_hover" class="mouse_out_thumbnail"></div> <div id="prev-left" class="thumbnail-holder-left"></div><div id="page-left-0" class="thumbnail-page"></div><div id="prev-right" class="thumbnail-holder-right"><div id="page-left-1" class="thumbnail-page"></div></div></div></div>'+
                                    <div id="page0" style="left:0%;" class="thumbnail-final"> <div id="page0-thumbnail" class="inner_thumbnail"> <div id="page-number-0" class="thumbnail-page">1</div><div id="page0Hover" class="mouse_out_thumbnail"></div> <div id="page0-left" class="thumbnail-holder-left"> </div><div id="page0-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div> </div></div>'+
                                    <div id="page1" style="left:15%;" class="thumbnail-final"> <div id="page1-thumbnail" class="inner_thumbnail"> <div id="page-number-1" class="thumbnail-page">2 - 3</div> <div id="page1Hover" class="mouse_out_thumbnail"></div> <div id="page1-left" class="thumbnail-holder-left">  <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div>  </div><div id="page1-right" class="thumbnail-holder-right"> <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div> </div></div></div>
                                    <div id="page2" style="left:30%;" class="thumbnail-final"> <div id="page2-thumbnail" class="inner_thumbnail"> <div id="page-number-2" class="thumbnail-page">4 - 5</div> <div id="page2Hover" class="mouse_out_thumbnail"></div> <div id="page2-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page2-right" class="thumbnail-holder-right"> <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div> </div></div></div>
                                    <div id="page3" style="left:45%" class="thumbnail-final"> <div id="page3-thumbnail" class="inner_thumbnail"> <div id="page-number-3" class="thumbnail-page">6 - 7</div> <div id="page3Hover" class="mouse_out_thumbnail"></div> <div id="page3-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page3-right" class="thumbnail-holder-right">  <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div> </div></div></div>
                                    <div id="page4" style="left:60%"class="thumbnail-final"> <div id="page4-thumbnail" class="inner_thumbnail"> <div id="page-number-4" class="thumbnail-page">8 - 9</div> <div id="page4Hover" class="mouse_out_thumbnail"></div> <div id="page4-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page4-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                                    <div id="page5" style="left:75%" class="thumbnail-final"> <div id="page5-thumbnail" class="inner_thumbnail"><div id="page-number-5" class="thumbnail-page">10 - 11</div><div id="page5Hover" class="mouse_out_thumbnail"></div> <div id="page5-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page5-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                                    <div id="page6" style="left:90%" class="thumbnail-final"> <div id="page6-thumbnail" class="inner_thumbnail"><div id="page-number-6" class="thumbnail-page">12 - 13</div><div id="page6_hover" class="mouse_out_thumbnail"></div> <div id="page6-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page6-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                                    <div id="page7" style="left:105%" class="thumbnail-final"> <div id="page7-thumbnail" class="inner_thumbnail"><div id="page-number-7" class="thumbnail-page">13 - 14</div><div id="page7_hover" class="mouse_out_thumbnail"></div> <div id="page7-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page7-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                                    </div>
                                    </div>
                                    <div id="nextthumbnail"><i id="arrow" class="fa fa-angle-up fa-2x fa-inverse"></i> </div>
                                    <div id="next-thumb-page"><i id="next-thumb-page-icon" class="fa fa-angle-right fa-4x fa-inverse"></i></div>
                                    <div id="prev-thumb-page"><i id="prev-thumb-page-icon" class="fa fa-angle-left  fa-4x"></i></div>
                                    </div>
                                    <div id="topnavbar">
                                        <div class="zoom-slider" ><input   id="zoomRange" name="zoomValue" type="range" min="0.5" max="1" value="0.5" step="0.1"  /></div>
                                        <div class="navbuttons" > <div id="prev_nav" class="prev_nav_button"> </div> <div id="next_nav" class="next_nav_button"> </div> </div>
                                         <div id="showPage" > </div> 
                                    </div>

                                     <div class="mfp-close"  style="  z-index:4000">
                                     [x]
                                    </div> 

                                    <div id ="lp-book" style="overflow: hidden">
                                    <div id="lp-right-page"> </div>
                                    <div id="lp-left-page">  </div>
                                    <div id="lp-left"> <div id="lp-inner-left"><div id="lp-clip"> <div id="lp-inner-clip">  </div> </div></div> <div id="lp-inner-2-left"> <div id="lp-clip2" style="backgroung-color:white;"></div></div> </div>
                                    <div id="lp-right"><div id="lp-inner-right"><div id="lp-right-clip"><div id="lp-right-inner-clip">  </div></div></div><div id="lp-inner-2-right"><div id="lp-right-clip2">  </div></div></div>
                                    </div>
                                </div>    
                                <div id="lpcontainer">
                                </div>
                        </div>
                    </div>
            </div>

            <?php 

        }else{
            
            $postid = get_the_ID();
            ?>
        <div style='position:fixed; overflow:hidden; width:100%; height:100%; background-color:blue; display:block; top:0; left:0;z-index:1000'> 
            <div id='flipbook' style=" overflow:hidden; width:100%; height:100%; background-color:rgba(0,0,0,0.9); position:absolute; top:0;left:0;bottom:0;right:0;"> 
                <div id="lpco" style="position:absolute;   background-img:url('images/texture.png'); width:100%; height:100%;">
                    <div id="lp"  style="position:absolute; overflow:hidden; height:100%; width:100%; top: 0; left:0; bottom:0;  right: 0;margin:auto">
                        <div id="nextbtn"></div>
                        <div id="prevbtn"> </div>
                        <div id="thumbnails">
                        <div id="faulu" class="thumbnails-nav">
                        <div id="current-nav" class="thumbnails-nav-current">
                        <div id="next_lp" class="thumbnails-nav-next thumbnail-final"> <div id="next-thumbnail" class="inner_thumbnail"> <div id="next_hover" class="mouse_out_thumbnail"></div> <div id="next-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="next-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                        <div  id="prev-flipbook_popup" class="thumbnails-nav-prev thumbnail-final"> <div id="prev-thumbnail" class="inner_thumbnail"> <div id="prev-flipbook_popup_hover" class="mouse_out_thumbnail"></div> <div id="prev-left" class="thumbnail-holder-left"></div><div id="page-left-0" class="thumbnail-page"></div><div id="prev-right" class="thumbnail-holder-right"><div id="page-left-1" class="thumbnail-page"></div></div></div></div>'+
                        <div id="page0" style="left:0%;" class="thumbnail-final"> <div id="page0-thumbnail" class="inner_thumbnail"> <div id="page-number-0" class="thumbnail-page">1</div><div id="page0Hover" class="mouse_out_thumbnail"></div> <div id="page0-left" class="thumbnail-holder-left"> </div><div id="page0-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div> </div></div>'+
                        <div id="page1" style="left:15%;" class="thumbnail-final"> <div id="page1-thumbnail" class="inner_thumbnail"> <div id="page-number-1" class="thumbnail-page">2 - 3</div> <div id="page1Hover" class="mouse_out_thumbnail"></div> <div id="page1-left" class="thumbnail-holder-left">  <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div>  </div><div id="page1-right" class="thumbnail-holder-right"> <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div> </div></div></div>
                        <div id="page2" style="left:30%;" class="thumbnail-final"> <div id="page2-thumbnail" class="inner_thumbnail"> <div id="page-number-2" class="thumbnail-page">4 - 5</div> <div id="page2Hover" class="mouse_out_thumbnail"></div> <div id="page2-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page2-right" class="thumbnail-holder-right"> <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div> </div></div></div>
                        <div id="page3" style="left:45%" class="thumbnail-final"> <div id="page3-thumbnail" class="inner_thumbnail"> <div id="page-number-3" class="thumbnail-page">6 - 7</div> <div id="page3Hover" class="mouse_out_thumbnail"></div> <div id="page3-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page3-right" class="thumbnail-holder-right">  <div class="thumbnail-spinner"><div class="thumbnail-spinner-inner"><i class="fa fa-circle-o-notch fa-spin"></i></div></div> </div></div></div>
                        <div id="page4" style="left:60%"class="thumbnail-final"> <div id="page4-thumbnail" class="inner_thumbnail"> <div id="page-number-4" class="thumbnail-page">8 - 9</div> <div id="page4Hover" class="mouse_out_thumbnail"></div> <div id="page4-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page4-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                        <div id="page5" style="left:75%" class="thumbnail-final"> <div id="page5-thumbnail" class="inner_thumbnail"><div id="page-number-5" class="thumbnail-page">10 - 11</div><div id="page5Hover" class="mouse_out_thumbnail"></div> <div id="page5-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page5-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                        <div id="page6" style="left:90%" class="thumbnail-final"> <div id="page6-thumbnail" class="inner_thumbnail"><div id="page-number-6" class="thumbnail-page">12 - 13</div><div id="page6_hover" class="mouse_out_thumbnail"></div> <div id="page6-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page6-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                        <div id="page7" style="left:105%" class="thumbnail-final"> <div id="page7-thumbnail" class="inner_thumbnail"><div id="page-number-7" class="thumbnail-page">13 - 14</div><div id="page7_hover" class="mouse_out_thumbnail"></div> <div id="page7-left" class="thumbnail-holder-left"><image src="" width="100%" height="100%"></div><div id="page7-right" class="thumbnail-holder-right"><image src="" width="100%" height="100%"></div></div></div>
                        </div>
                        </div>
                        <div id="nextthumbnail"><i id="arrow" class="fa fa-angle-up fa-2x fa-inverse"></i> </div>
                        <div id="next-thumb-page"><i id="next-thumb-page-icon" class="fa fa-angle-right fa-4x fa-inverse"></i></div>
                        <div id="prev-thumb-page"><i id="prev-thumb-page-icon" class="fa fa-angle-left  fa-4x"></i></div>
                        </div>
                        <div id="topnavbar">
                            <div class="zoom-slider" ><input   id="zoomRange" name="zoomValue" type="range" min="0.5" max="1" value="0.5" step="0.1"  /></div>
                            <div class="navbuttons" > <div id="prev_nav" class="prev_nav_button"> </div> <div id="next_nav" class="next_nav_button"> </div> </div>
                             <div id="showPage" > </div> 
                        </div>
                        <div id ="lp-book" style="overflow: hidden">
                        <div id="lp-right-page"> </div>
                        <div id="lp-left-page">  </div>
                        <div id="lp-left"> <div id="lp-inner-left"><div id="lp-clip"> <div id="lp-inner-clip">  </div> </div></div> <div id="lp-inner-2-left"> <div id="lp-clip2" style="backgroung-color:white;"></div></div> </div>
                        <div id="lp-right"><div id="lp-inner-right"><div id="lp-right-clip"><div id="lp-right-inner-clip">  </div></div></div><div id="lp-inner-2-right"><div id="lp-right-clip2">  </div></div></div>
                        </div>
                    </div>    
                    <div id="lpcontainer">
                    </div>
                </div>
            </div>
        </div>
            <?php 
                $pdf_worker_path = plugins_url("js/pdf.worker.js", __FILE__);
                $pdf_path_url = get_post_meta( $postid, 'pdf_file_attachment', true );
            ?>

            <script type="text/javascript">
                jQuery(function () {
                    jQuery('#btnflipbook').magnificPopup({
                        type: 'inline',
                        preloader: true,
                        focus: '#lpco',
                        modal: true,
                        closeBtnInside: true,
                        showCloseBtn: true 
                    });

                    jQuery(document).ready(function(){
                        $ = jQuery
                        PDFJS.workerSrc = "<?php echo($pdf_worker_path); ?>";
                        webViewerInitialized("<?php echo($pdf_path_url); ?>");
                    });
                });
            </script>
        <?php
        }            
    }
/**
 * Prints the box content.
 * 
 * @param WP_Post $post The object for the current post/page.
 */
    public function myplugin_meta_box_callback( $post ) {

        // Add an nonce field so we can check for it later.
        wp_nonce_field( 'myplugin_meta_box', 'myplugin_meta_box_nonce' );

        /*
         * Use get_post_meta() to retrieve an existing value
         * from the database and use the value for the form.
         */
        $value = get_post_meta( $post->ID, '_my_meta_value_key', true );

        echo '<label for="myplugin_new_field">';
        _e( 'Description for this field', 'myplugin_textdomain' );
        echo '</label> ';
        echo '<input type="text" id="myplugin_new_field" name="myplugin_new_field" value="' . esc_attr( $value ) . '" size="25" />';
    }


    public function wp_flipbook_shortcode() {
        $postid = get_the_ID();
        wp_nonce_field(plugin_basename(__FILE__), 'wp_flipbook_shortcode');
        $html = "";
        $html .= "<p class='description'> Use the following shortcode to include this pdf publication in your blog posts and pages. </p> </br>";
        $html .= "[flipbook id='$postid']";
        echo $html;
    }

    public function wp_flipbook_pdf_file(){
        $postid = get_the_ID();
        wp_nonce_field( plugin_basename( __FILE__ ), 'upload_image_nonce' );
        $html = "";
        $html .= '<label for="upload_image">';
        $html .= '<input id="upload_image" type="text" size="36" name="ad_image" value="" />';
        $html .= '<input id="upload_image_button" class="button" type="button" value="Select PDF" />';
        $html .= '</label>';
        echo $html;

    }

    public function wp_flipbook_thumbnail(){
        $current_post_id = get_the_ID(); 
        $uploaded_thumbnail = get_post_meta( $current_post_id, 'wp_flipbook_thumbnail', true );

        if(isset($uploaded_thumbnail['url'])){
            $thumbnail_path = $uploaded_thumbnail['url'];
        }else{
            $thumbnail_path ="";
        }

        $wp_name = basename( $thumbnail_path);


        $html = '<p class="description">';
        $html .= 'Upload your Publication Thumbnail in here.';
        $html .= '</p>';
        $html .= "<span style='padding:30px;'><img src='$thumbnail_path' width='20%' height='20%'><img> </span> </br>";
        $html .= '<input type="file" id="wp_flipbook_thumbnail" name="wp_flipbook_thumbnail" value="$thumbnail_path" size="25">';
        echo $html;
    }

    public function save_pdf_attachment_file() {
        $post_id = get_the_ID();

        global $custom_meta_fields;  

        //Verify if its auto saving routine
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
        return;

        // Secondly we need to check if the user intended to change this value.
        if ( ! isset( $_POST['upload_image_nonce'] ) || ! wp_verify_nonce( $_POST['upload_image_nonce'], plugin_basename( __FILE__ ) ) )
          return;

        $pdf_file_path = $_POST['ad_image'];
         // loop through fields and save the data
        update_post_meta($post_id,'pdf_file_attachment' , $pdf_file_path);
    }

    public function save_thumbnail_file() {
        $post_id = get_the_ID();
        if(!empty($_FILES['wp_flipbook_thumbnail']['name'])) {
            $supported_types = array('jpg');
            $arr_file_type = wp_check_filetype(basename($_FILES['wp_flipbook_thumbnail']['name']));
            $uploaded_type = $arr_file_type['type'];

            $upload = wp_upload_bits($_FILES['wp_flipbook_thumbnail']['name'], null, file_get_contents($_FILES['wp_flipbook_thumbnail']['tmp_name']));
            if(isset($upload['error']) && $upload['error'] != 0) {
                wp_die('There was an error uploading your file. The error is: ' . $upload['error']);
            } else {
                update_post_meta($post_id, 'wp_flipbook_thumbnail', $upload);
            }
        }
    }



    public function addActionsAndFilters() {
        // Add options administration page
        // http://plugin.michael-simpson.com/?page_id=47

        add_action('admin_menu', array(&$this, 'addSettingsSubMenuPage'));
        add_action('init', array(&$this, 'create_posttype'));
        add_action('widgets_init', array(&$this, 'remove_sidebar'));
        add_action('wp_footer', array(&$this, 'add_lightbox_script'));
        add_action('add_meta_boxes', array(&$this, 'add_events_metaboxes'));  

        add_action('save_post', array(&$this,'save_pdf_attachment_file'));
        add_action('save_post', array(&$this,'save_thumbnail_file')); 
        add_action('post_edit_form_tag', array(&$this,'update_edit_form'));
        add_action('wp_enqueue_scripts', array(&$this,'wp_enqueue_script'));


        add_action('admin_enqueue_scripts', array(&$this,'my_admin_scripts'));
 
        
        // Hooking up our function to theme setup
        //add_action( 'init', 'create_posttype' );   

        // Example adding a script & style just for the options administration page
        // http://plugin.michael-simpson.com/?page_id=47
        //        if (strpos($_SERVER['REQUEST_URI'], $this->getSettingsSlug()) !== false) {
        //            wp_enqueue_script('my-script', plugins_url('/js/my-script.js', __FILE__));
        //            wp_enqueue_style('my-style', plugins_url('/css/my-style.css', __FILE__));
        //        }



   
      
        // Register short codes
        // http://plugin.michael-simpson.com/?page_id=39


        // Register AJAX hooks
        // http://plugin.michael-simpson.com/?page_id=41

    }

    public function my_admin_scripts() {
        wp_enqueue_media();
        wp_register_script('my-admin-js', plugins_url('js/my-admin.js', __FILE__), array('jquery'));
        wp_enqueue_script('my-admin-js');
        
    }

    // Add the Events Meta Boxes for shortcode ,pdf file and thumbnail 
    public function add_events_metaboxes() {
        add_meta_box('wp_flipbook_shortcode', 'Shortcode', array(&$this,'wp_flipbook_shortcode'), 'publications', 'normal', 'high');
        add_meta_box('wp_flipbook_pdf_file', 'PDF File', array(&$this,'wp_flipbook_pdf_file'), 'publications','normal','high');
        add_meta_box('wp_flipbook_thumbnail', 'Thumbnail ', array(&$this,'wp_flipbook_thumbnail'), 'publications','normal','high');

    }

    //FIle upload

    public function update_edit_form() {
        echo ' enctype="multipart/form-data"';
    }


    //Add stylesheets
    public function wp_enqueue_script(){
        wp_enqueue_style('book', plugins_url('css/book.css', __FILE__));
        wp_enqueue_style('magnific-css',plugins_url('css/magnific-popup.css', __FILE__));
        wp_enqueue_style('grid-css',plugins_url('css/grid.css', __FILE__));



          // Adding scripts & styles to all pages
        // Examples:
        wp_enqueue_script('jquery');
        wp_enqueue_script('2dpoint', plugins_url('js/point.js', __FILE__));
        wp_enqueue_script('startbook', plugins_url('js/startbook.js', __FILE__));
        wp_enqueue_script('pdf_utils', plugins_url('js/utils.js', __FILE__));
        wp_enqueue_script('hammer', plugins_url('js/hammer.js', __FILE__));
        wp_enqueue_script('compatibility', plugins_url('js/compatibility.js', __FILE__));
        wp_enqueue_script('pdfjs', plugins_url('js/pdf.js', __FILE__));
        wp_enqueue_script('pointer', plugins_url('js/pointer.js', __FILE__));
        wp_enqueue_script('events', plugins_url('js/events.js', __FILE__));
        wp_enqueue_script('book', plugins_url('js/book.js', __FILE__));
        wp_enqueue_script('page_view', plugins_url('js/page_view.js', __FILE__));
        wp_enqueue_script('jquery_magnific_popup', plugins_url('js/jquery.magnific-popup.min.js', __FILE__));

    }

}
