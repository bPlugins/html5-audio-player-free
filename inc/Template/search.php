<?php 
if (!defined('ABSPATH')) {
    exit;
}

get_header();
$query = isset($_GET['bps']) ? sanitize_text_field(wp_unslash($_GET['bps'])) : '';
$loop = new WP_Query( array(
    'post_type' => 'audioplayer',
    'posts_per_page' => 12,
    's' => $query
));
?>

<div class="h5ap_search_template"><h1>Result for "<?php echo esc_html($query); ?>" </h1>
  <?php 
  while($loop->have_posts()): $loop->the_post(); 
    echo do_shortcode('[player id='.get_the_ID().']');
  endwhile;
  ?>
</div>

<?php
get_footer();