(function ($, window, document, undefined) {
  "use strict";

  $(document).ready(function () {
    
    $(".abu-button-set-trigger").each(function () {
      var $buttons = $(this).find(".csf--button");

      $buttons.each(function () {
        var $button = $(this);

        $button.on("click", function () {
          // console.log('clicked', $(this))

          var $this = $(this),
            value = $this.find("input").val(),
            $boxes = $(".abu-metabox");

          $boxes.each(function () {
            var $box = $(this);

            if ($box.hasClass("abu-metabox-" + value)) {
              $box.removeClass("abu-metabox-hidden");
            } else {
              $box.addClass("abu-metabox-hidden");
            }
          });
        });

        if ($button.find("input").prop("checked")) {
          $button.trigger("click");
        }
      });
    });
  });
})(jQuery, window, document);
