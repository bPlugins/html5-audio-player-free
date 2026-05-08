<?php

namespace H5APPlayer\PostType;

class RadioPlayer
{
    protected static $_instance = null;

    /**
     * construct function
     */
    private $post_type = 'radioplayer';
    public function register()
    {
        add_action('init', [$this, 'init'], 20);
        if (is_admin()) {
            add_filter('post_row_actions', [$this, 'h5ap_remove_row_actions'], 10, 2);
            add_filter('manage_radioplayer_posts_columns', [$this, 'h5ap_columns_head_only_radioplayer'], 10);
            add_action('manage_radioplayer_posts_custom_column', [$this, 'h5ap_columns_content_only_radioplayer'], 10, 2);
            add_filter('post_updated_messages', [$this, 'h5ap_updated_messages']);

            // duplicate audio player
            add_filter('post_row_actions', [$this, 'add_duplicate_post_link'], 10, 2);
            add_action('admin_action_bp_duplicate_post_as_draft', [$this, 'duplicate_post_action']);


            add_action('use_block_editor_for_post', [$this, 'forceGutenberg'], 10, 2);
        }
    }

    /**
     * Create instance function
     */
    public static function instance()
    {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * init
     */
    public function init(){
        register_post_type(
            $this->post_type,
            array(
                'labels' => array(
                    'name' => __('Radio Player'),
                    'singular_name' => __('Radio Player'),
                    'add_new' => __('Add Radio Player'),
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
                'menu_position' => 5,
                // 'menu_icon' => H5AP_PRO_PLUGIN_DIR . '/assets/images/icn.png',
                'has_archive' => false,
                'hierarchical' => false,
                'capability_type' => 'page',
                'rewrite' => array('slug' => 'radioplayer'),
                'supports' => array('title', 'editor'),
                'show_in_rest' => true,
                'show_in_menu' => 'html5-audio-player',
                'template' => [
                    ['h5ap/radio-player']
                ],
                'template_lock' => 'all',
            )
        );

        h5ap_register_taxonomy('radioplayer-category', $this->post_type, true, 'Category');
        h5ap_register_taxonomy('radioplayer-tags', $this->post_type, false, 'Tag');

        register_post_meta('', 'h5ap_radio_sources', [
            'type'              => 'object',
            'single'            => true,
            'sanitize_callback' => function ($value) {
                // sanitize each dynamic field
                if (! is_array($value)) return [];
                return array_map('sanitize_url', $value);
            },
            'show_in_rest'      => [
                'schema' => [
                    'type' => 'object',
                    'additionalProperties' => ['type' => 'string'],
                ],
            ],
        ]);
    }

    public function forceGutenberg($use, $post)
    {
        if ($this->post_type === $post->post_type) {
            return true;
        }

        return $use;
    }

    /**
     * Remove Row
     */
    function h5ap_remove_row_actions($idtions)
    {
        global $post;
        if ($post->post_type == $this->post_type) {
            unset($idtions['view']);
            unset($idtions['inline hide-if-no-js']);
        }
        return $idtions;
    }

    // CREATE TWO FUNCTIONS TO HANDLE THE COLUMN
    function h5ap_columns_head_only_radioplayer($defaults)
    {
        unset($defaults['date']);
        $defaults['shortcode'] = 'ShortCode';
        $defaults['date'] = 'Date';
        return $defaults;
    }

    function h5ap_columns_content_only_radioplayer($column_name, $post_ID)
    {
        if ($column_name == 'shortcode') {
?>
            <div class='h5ap_front_shortcode'><input style='text-align: center; border: none; outline: none; background-color: #1e8cbe; color: #fff; padding: 4px 10px; border-radius: 3px;width:220px;' value='[h5ap_radio_player id="<?php echo esc_attr($post_ID) ?>"]' /><span class='htooltip'>Copy To Clipboard</span></div>
<?php
        }
    }

    function h5ap_updated_messages($messages)
    {
        $messages[$this->post_type][1] = __('Player updated ');
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
