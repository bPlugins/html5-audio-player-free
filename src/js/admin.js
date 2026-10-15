(function ($) {
  $(document).ready(function () {
    //import data ajax call
    $(document).on("click", ".h5ap_import_data", function (e) {
      e.preventDefault();
      $.ajax({
        url: h5apAdmin?.ajaxUrl,
        data: {
          action: "h5ap_import_data",
        },
        success: (data) => {
          const result = JSON.parse(data);
          if (result?.success === true) {
            location.href = location.href + "?h5ap-import=success";
          }
        },
      });
    });

    // copy to clipboard
    $(".h5ap_front_shortcode input").on("click", function (e) {
      e.preventDefault();

      let shortcode = $(this).parent().find("input")[0];
      shortcode.select();
      shortcode.setSelectionRange(0, 30);
      document.execCommand("copy");
      $(this).parent().find(".htooltip").text("Copied Successfully!");
    });

    $(".h5ap_front_shortcode input").on("mouseout", function () {
      $(this).parent().find(".htooltip").text("Copy To Clipboard");
    });

    // Single Play button
    $(".h5ap_single_button").on("click", ".play", function () {
      $(".h5ap_single_button audio")[0].play();
      $(".h5ap_single_button .play").hide();
      $(".h5ap_single_button .pause").show();
    });

    $(".h5ap_single_button").on("click", ".pause", function () {
      $(".h5ap_single_button audio")[0].pause();
      $(".h5ap_single_button .play").show();
      $(".h5ap_single_button .pause").hide();
    });

    // Transcript: "Import SRT / VTT file" button next to every transcript box in the player settings
    // (the Standard/Sticky player's box and each playlist track's box).
    const toolsDone = typeof WeakSet !== "undefined" ? new WeakSet() : null;
    const addTranscriptTools = function () {
      // Skip Codestar's hidden row template: new rows are copied from it.
      if ((toolsDone && toolsDone.has(this)) || $(this).closest(".csf-cloneable-hidden").length) {
        return;
      }
      toolsDone?.add(this);
      const textarea = $(this);
      // A row made with Codestar's "Clone" copies the toolbar of the row it came from; replace it.
      textarea.prevAll(".h5ap-transcript-tools").remove();
      const i18n = window.h5apAdmin?.transcript || {};
      const fileInput = $('<input type="file" accept=".srt,.vtt,text/vtt,application/x-subrip" hidden>');
      const button = $('<button type="button" class="button h5ap-transcript-import"></button>').text(i18n.import || "Import SRT / VTT file");
      const message = $('<span class="h5ap-transcript-import__msg" role="status"></span>');

      button.on("click", () => fileInput.trigger("click"));
      fileInput.on("change", function () {
        const file = this.files && this.files[0];
        this.value = "";
        if (!file) {
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          message.text(i18n.tooBig || "This file is larger than 2 MB.");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          textarea.val(reader.result).trigger("change");
          message.text(i18n.imported || "Imported. Click Update to save.");
        };
        reader.readAsText(file);
      });

      const tools = $('<div class="h5ap-transcript-tools"></div>');
      $('<div class="h5ap-transcript-import"></div>').append(button, message, fileInput).appendTo(tools);

      // "Generate with AI" is part of the Pro version: link to the upgrade page.
      if (i18n.proUrl) {
        $('<div class="h5ap-transcript-ai-locked"></div>')
          .append($('<a class="button" target="_blank" rel="noopener"></a>').attr("href", i18n.proUrl).text(i18n.aiLocked || "Generate with AI").append(' <span class="h5ap-pro-badge">PRO</span>'))
          .append($('<span class="h5ap-transcript-import__msg"></span>').text(i18n.aiLockedHelp || ""))
          .appendTo(tools);
      }
      tools.insertBefore(textarea);
      // The Pro AI script fills new slots too.
      document.dispatchEvent(new CustomEvent("h5ap:transcript-tools", { detail: { tools: tools[0] } }));
    };
    $(".h5ap-transcript-textarea").each(addTranscriptTools);

    // Playlist tracks added later (Codestar "Add" / "Clone") get the buttons too.
    const metabox = document.getElementById("_h5ap_plyr") || document.querySelector(".csf-metabox");
    if (metabox && typeof MutationObserver !== "undefined") {
      new MutationObserver(() => $(metabox).find(".h5ap-transcript-textarea").each(addTranscriptTools)).observe(metabox, { childList: true, subtree: true });
    }

    const style = $(".h5ap_single_button").data("settings");

    if (!style) return false;

    $("input[name='h5ap_settings[button_color]']").on("change", function () {
      style.color = $(this)[0].value;
      handleChange();
    });

    $("input[name='h5ap_settings[button_size]']").on("change", function () {
      style.size = $(this)[0].value;
      handleChange();
    });

    $("input[name='h5ap_settings[button_background]']").on("change", function () {
      style.background = $(this)[0].value;
      handleChange();
    });

    $("input[name='h5ap_settings[dimention][width]']").on("change", function () {
      style.dimention.width = $(this)[0].value;
      handleChange();
    });
    $("input[name='h5ap_settings[dimention][height]']").on("change", function () {
      style.dimention.height = $(this)[0].value;
      handleChange();
    });
    $("input[name='h5ap_settings[radius][width]']").on("change", function () {
      style.radius.width = $(this)[0].value;
      handleChange();
    });
    $("select[name='h5ap_settings[dimention][unit]']").on("change", function () {
      style.unit = $(this)[0].value;
      handleChange();
    });
    $("select[name='h5ap_settings[radius][unit]']").on("change", function () {
      style.radius.unit = $(this)[0].value;
      handleChange();
    });

    handleChange();

    function handleChange() {
      const {
        color,
        background,
        size,
        dimention: { height = 50, width = 50, unit = "px" },
        radius = {},
      } = style;
      $(".h5ap_single_button svg").css({ fill: color, height: size, width: size });
      $(".h5ap_single_button").css({
        background,
        height: height + unit,
        width: width + unit,
        "border-radius": radius?.width + radius?.unit,
      });
    }

    setCookie("dipvai", "ebar ekhane eid korbe", 10000);

    function setCookie(cookieName, cookieValue, expiryInSeconds) {
      var expiry = new Date();
      expiry.setTime(expiry.getTime() + 1000 * expiryInSeconds);
      document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expiry.toGMTString() + ";path=/";
    }
  });
})(jQuery);
