<?php

namespace H5APPlayer\PostType;

class AudioPlayer
{
    protected static $_instance = null;

    /**
     * construct function
     */
    private $post_type = 'audioplayer';
    public function register()
    {
        add_action('init', [$this, 'init'], 20);
        if (is_admin()) {
            add_filter('post_row_actions', [$this, 'h5ap_remove_row_actions'], 10, 2);
            add_action('edit_form_after_title', [$this, 'h5ap_shortcode_area']);
            add_filter('manage_audioplayer_posts_columns', [$this, 'h5ap_columns_head_only_audioplayer'], 10);
            add_action('manage_audioplayer_posts_custom_column', [$this, 'h5ap_columns_content_only_audioplayer'], 10, 2);
            add_filter('post_updated_messages', [$this, 'h5ap_updated_messages']);

            // duplicate audio player
            add_filter('post_row_actions', [$this, 'add_duplicate_post_link'], 10, 2);
            add_action('admin_action_bp_duplicate_post_as_draft', [$this, 'duplicate_post_action']);
        }
    }

    
    public static function instance(){
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function init(){
        register_post_type(
            'audioplayer',
            array(
                'labels' => array(
                    'name' => __('Audio Player'),
                    'singular_name' => __('Audio Player'),
                    'add_new' => __('Add Audio Player'),
                    'add_new_item' => __('Add New Player'),
                    'edit_item' => __('Edit Player'),
                    'new_item' => __('New Player'),
                    'view_item' => __('View Player'),
                    'search_items'       => __('Search Player'),
                    'not_found' => __('Sorry, we couldn\'t find the Player you are looking for.')
                ),
                'public' => false,
                'show_ui' => true,
                'publicly_queryable' => true,
                'exclude_from_search' => true,
                'menu_position' => 1,
                'menu_icon' => H5AP_PRO_PLUGIN_DIR . '/assets/images/icn.png',
                'show_in_menu' => 'html5-audio-player',
                'has_archive' => false,
                'hierarchical' => false,
                'capability_type' => 'page',
                'rewrite' => array('slug' => 'audioplayer'),
                'supports' => array('title'),
                'show_in_rest' => true,
            )
        );

        // Register taxonomy for audio player
        h5ap_register_taxonomy('audio-player-category', 'audioplayer', true, 'Category');
        h5ap_register_taxonomy('audio-player-tags', 'audioplayer', false, 'Tag');
    }

    function h5ap_remove_row_actions($idtions){
        global $post;
        if ($post->post_type == 'audioplayer') {
            unset($idtions['view']);
            unset($idtions['inline hide-if-no-js']);
        }
        return $idtions;
    }

    // CREATE TWO FUNCTIONS TO HANDLE THE COLUMN
    function h5ap_columns_head_only_audioplayer($defaults){
        unset($defaults['date']);
        $defaults['shortcode'] = 'ShortCode';
        $defaults['date'] = 'Date';
        return $defaults;
    }

    function h5ap_columns_content_only_audioplayer($column_name, $post_ID){
        if ($column_name == 'shortcode') { 
            ?>
                <div class='h5ap_front_shortcode'><input style='text-align: center; border: none; outline: none; background-color: #1e8cbe; color: #fff; padding: 4px 10px; border-radius: 3px;' value='[player id="<?php echo esc_attr($post_ID) ?>"]'><span class='htooltip'>Copy To Clipboard</span></div>
            <?php
        }
    }

   function h5ap_shortcode_area() {
        global $post;
        if ($post->post_type == 'audioplayer') {
            ?>
            <style>
                .h5ap_shortcode {
                    margin-top: 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #ffffff;
                    padding-left: 10px;
                }
                .h5ap_shortcode .shortcode_copy {
                    display: inline-block;
                    padding: 6px 10px;
                    font-family: monospace;
                    font-size: 13px;
                    background: #f6f7f7;
                    border: 1px solid #dcdcde;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: 0.15s ease;
                }
                .h5ap_shortcode .shortcode_copy:hover {
                    background-color: #f0f0f1;
                    border-color: #2271b1;
                }
                .h5ap_shortcode .shortcode_desc {
                    font-size: 16px;
                    font-weight: bold;
                    color: #646970;
                }
            </style>
            <div class="h5ap_shortcode">
                <p class="shortcode_desc">
                    <?php echo esc_html__("Copy this shortcode and paste it into your post, page, or text widget content:", "h5ap") ?>
                </p>
                 <code 
                    class="shortcode_copy" 
                    data-code="[player id='<?php echo esc_attr($post->ID); ?>']">
                    [player id='<?php echo esc_attr($post->ID); ?>']
                </code>
            </div>
            <?php
        }
    }

    function h5ap_updated_messages($messages)
    {
        $messages['audioplayer'][1] = __('Player updated ');
        return $messages;
    }

    // Add a "Duplicate" link to the action links for a custom post type
    function add_duplicate_post_link($actions, $post)
    {
        if (current_user_can('edit_posts') && $post->post_type == $this->post_type) {
            $actions['duplicate'] = '<a href="' . wp_nonce_url('admin.php?action=bp_duplicate_post_as_draft&post=' . $post->ID, basename(__FILE__), 'duplicate_nonce') . '" title="Duplicate this item" rel="permalink">Duplicate</a>';
        }
        return $actions;
    }

    // Handle the duplication process when the "Duplicate" link is clicked
    function duplicate_post_action()
    {
        global $wpdb;
        if (! (isset($_GET['post']) || isset($_POST['post'])  || (isset($_REQUEST['action']) && 'bp_duplicate_post_as_draft' == $_REQUEST['action']))) {
            wp_die('No post to duplicate has been supplied!');
        }

        /*
        * Nonce verification
        */
        if (!isset($_GET['duplicate_nonce']) || !wp_verify_nonce($_GET['duplicate_nonce'], basename(__FILE__)))
            return;

        /*
        * get the original post id
        */
        $post_id = (isset($_GET['post']) ? absint($_GET['post']) : absint($_POST['post']));
        /*
        * and all the original post data then
        */
        $post = get_post($post_id);

        /*
        * if you don't want current user to be the new post author,
        * then change next couple of lines to this: $new_post_author = $post->post_author;
        */
        $current_user = wp_get_current_user();
        $new_post_author = $current_user->ID;

        /*
        * if post data exists, create the post duplicate
        */
        if (isset($post) && $post != null) {

            /*
            * new post data array
            */
            $args = array(
                'comment_status' => $post->comment_status,
                'ping_status'    => $post->ping_status,
                'post_author'    => $new_post_author,
                'post_content'   => $post->post_content,
                'post_excerpt'   => $post->post_excerpt,
                'post_name'      => $post->post_name,
                'post_parent'    => $post->post_parent,
                'post_password'  => $post->post_password,
                'post_status'    => 'draft',
                'post_title'     => $post->post_title,
                'post_type'      => $post->post_type,
                'to_ping'        => $post->to_ping,
                'menu_order'     => $post->menu_order
            );

            /*
            * insert the post by wp_insert_post() function
            */
            $new_post_id = wp_insert_post($args);

            /*
            * get all current post terms ad set them to the new post draft
            */
            $taxonomies = get_object_taxonomies($post->post_type); // returns array of taxonomy names for post type, ex array("category", "post_tag");
            foreach ($taxonomies as $taxonomy) {
                $post_terms = wp_get_object_terms($post_id, $taxonomy, array('fields' => 'slugs'));
                wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
            }

            /*
            * duplicate all post meta just in two SQL queries
            */
            $post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$post_id");
            if (count($post_meta_infos) != 0) {
                $sql_query = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) ";
                foreach ($post_meta_infos as $meta_info) {
                    $meta_key = $meta_info->meta_key;
                    if ($meta_key == '_wp_old_slug') continue;
                    $meta_value = addslashes($meta_info->meta_value);
                    $sql_query_sel[] = "SELECT $new_post_id, '$meta_key', '$meta_value'";
                }
                $sql_query .= implode(" UNION ALL ", $sql_query_sel);
                $wpdb->query($sql_query);
            }


            /*
            * finally, redirect to the edit post screen for the new draft
            */
            wp_redirect(admin_url('post.php?action=edit&post=' . $new_post_id));
            exit;
        } else {
            wp_die('Post creation failed, could not find original post: ' . esc_html($post_id));
        }
    }
}
