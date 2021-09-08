(function ($) {
  // Document ready
  $(function () {
    // // Anijs helper
    // //Obtaining the default helper
    // if (typeof AniJS !== "undefined") {
    //   var animationHelper = AniJS.getHelper();
    //   // Defining afterAnimationFunction
    //   animationHelper.rebuildSwiper = function (e, animationContext) {
    //     // swiper-container
    //     animationHelper.fireOnce(e, animationContext);
    //     const swiper = $(e.target).find(".swiper-container")[0].swiper;
    //     if (swiper) {
    //       setTimeout(() => {
    //         swiper.update();
    //       }, 900);
    //     }
    //   };
    // }

    $(".text-spoiler__close-btn").on("click", function (e) {
      e.preventDefault();
      const $parent = $(this).closest(".text-spoiler");
      const $content = $parent.find(".text-spoiler__content");

      $content.css("max-height", "");
      setTimeout(() => {
        $parent.removeClass("active");
      }, 300);
    });

    // Simple phone input mask
    $(".phone-input-mask").on("keypress paste", function (evt) {
      // ^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$
      var theEvent = evt || window.event;

      var key = null;
      // Handle paste
      if (theEvent.type === "paste") {
        key = event.clipboardData.getData("text/plain");
      } else {
        // Handle key press
        key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
      }
      var regex = /([0-9() +-])/;
      if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
      }
    });

    // Init aos
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        once: true,
      });
      document.addEventListener("aos:in", ({ detail }) => {
        if ($(detail).data("aos") === "slide-left") {
          const container = $(detail).find(".swiper-container");
          if (container && container[0]) {
            const swiper = container[0].swiper;
            if (swiper) {
              setTimeout(() => {
                swiper.update();
              }, 600);
              setTimeout(() => {
                swiper.update();
              }, 1200);
            }
          }
        }
      });
      $(".swiper-container").each(function () {
        setTimeout(() => {
          let swiper = $(this)[0].swiper;
          if (swiper) {
            swiper.update();
          }
        }, 1200);
        setTimeout(() => {
          let swiper = $(this)[0].swiper;
          if (swiper) {
            swiper.update();
          }
        }, 2400);
      });
    }

    // Ajax form submit / Аякс форма настраивается тут
    $(".ajax-contact-form").on("submit", function (e) {
      e.preventDefault();
      const url = $(this).attr("action");
      const method = $(this).attr("method");
      const dataType = $(this).data("type") || null;
      const serializedArray = $(this).serializeArray();
      const self = $(this);

      let requestObj = {};
      serializedArray.forEach((item) => {
        requestObj[item.name] = item.value;
      });

      $(".form-success-message").addClass("d-none");

      $.ajax({
        url,
        type: method,
        dataType: dataType,
        data: {
          ...requestObj,
        },
        success: function (data) {
          // Clear inputs
          self
            .find(
              "input[type='text'], input[type='number'], input[type='tel'], input[type='email'], input[type='password'], textarea",
            )
            .val("");

          if (data !== "Email sent") {
            alert("Ошибка, повторите позднее");
            console.error(data);
            return;
          }

          // Success message
          if (self.hasClass("ajax-contact-form--modal")) {
            closePopup();
            openSuccessPopup();
          } else {
            self.find(".form-success-message").removeClass("d-none");
          }
        },
        error: function (data) {
          // Basic error handling
          alert("Ошибка, повторите позднее");
          console.error(data);
        },
      });
    });

    $(".ajax-file-form").on("submit", function (e) {
      e.preventDefault();
      const url = $(this).attr("action");
      const method = $(this).attr("method");
      const dataType = $(this).data("type") || null;
      const serializedArray = $(this).serializeArray();
      const self = $(this);

      const $fileInput = $(this).find('input[type="file"]');
      let file = null;
      if ($fileInput) {
        file = $fileInput[0].files[0];
      }

      const formData = new FormData();
      serializedArray.forEach((item) => {
        formData.append(item.name, item.value);
      });
      if (file) {
        formData.append("attachment", file);
      }

      $(".form-success-message").addClass("d-none");

      $.ajax({
        url,
        type: method,
        dataType: dataType,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          // Clear inputs
          self
            .find(
              "input[type='text'], input[type='number'], input[type='tel'], input[type='email'], input[type='file'], input[type='password'], textarea",
            )
            .val("");

          // Clear file input name
          $(".contact-form__file-name").html("").addClass("d-none");

          // Error handler
          if (data === "Wrong format") {
            alert("Неверный формат файла, разрешенный формат: PDF, DOCX, XLSX");
            return;
          }
          if (data === "Wrong file size") {
            alert("Превышен размер файла, разрешенный размер: 10МБ");
            return;
          }
          if (data !== "Email sent") {
            alert("Ошибка, повторите позднее");
            console.error(data);
            return;
          }

          // Success message
          if (self.hasClass("ajax-contact-form--modal")) {
            closePopup();
            openSuccessPopup();
          } else {
            self.find(".form-success-message").removeClass("d-none");
          }
        },
        error: function (data) {
          // Basic error handling
          alert("Ошибка, повторите позднее");
          console.error(data);
        },
      });
    });

    // Service filter
    $(".tag-menu__item-link").on("click", function () {
      const id = $(this).data("id");

      if (id === 0) {
        $(".service-card-container").removeClass("d-none");
      } else {
        $(".service-card-container").addClass("d-none");
        $(`.service-card-container[data-id="${id}"]`).removeClass("d-none");
      }

      $(".tag-menu__item").removeClass("active");
      $(this).parent().addClass("active");
    });
    if ($(".tag-menu").length) {
      let currentLocation = window.location.href;
      let currentUrl = new URL(currentLocation);
      let company_type = currentUrl.searchParams.get("company_type");

      if (company_type === "iq_solutions") {
        $(".service-card-container").addClass("d-none");
        $(`.service-card-container[data-id="1"]`).removeClass("d-none");

        $(".tag-menu__item").removeClass("active");
        $(`.tag-menu__item-link[data-id="1"]`).parent().addClass("active");
      }
      if (company_type === "iq_engineering") {
        $(".service-card-container").addClass("d-none");
        $(`.service-card-container[data-id="2"]`).removeClass("d-none");

        $(".tag-menu__item").removeClass("active");
        $(`.tag-menu__item-link[data-id="2"]`).parent().addClass("active");
      }
    }

    // Video popup
    $(".open-video-popup").on("click", function (e) {
      e.preventDefault();
      closePopup();

      const videoUrl = $(this).attr("href");

      if (!videoUrl || videoUrl === "#") {
        return;
      }

      $("body").addClass("overflow-hidden");
      // $("#videoPopup").removeClass("d-none");
      $("#videoPopup").fadeIn(300);

      $(".youtube-video-place").html(
        '<iframe allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="embed-responsive-item" src="' +
          videoUrl +
          '" ></iframe>',
      );
    });
    // Contact form popup
    $(".open-contact-popup").on("click", function (e) {
      e.preventDefault();
      closePopup();

      $("body").addClass("overflow-hidden");
      $("#contactPopup").fadeIn(300);
    });
    // Vacancy form popup
    $(".vacancy-card__cv-btn").on("click", function (e) {
      e.preventDefault();
      closePopup();
      $(".overlay-cdk__vacancy-position").find(".vac-pos").html("N/A");
      $(".overlay-cdk__vacancy-details").html("N/A");
      $("#vacancyPopupFormVacancyInput").val("");
      $("#vacancyPopupFormCompanyInput").val("");

      let $content = $(this).closest(".vacancy-card__content");
      let title = $content.find(".vacancy-card__content-title").text().trim();
      let $info = $content.find(".vacancy-card__info").clone();

      if (title) {
        $(".overlay-cdk__vacancy-position").find(".vac-pos").html(title);
        $("#vacancyPopupFormVacancyInput").val(title);
      }
      if ($info) {
        let company = $info.find(".vacancy-card__info-company").text().trim();
        $(".overlay-cdk__vacancy-details").html($info);
        if (company) {
          $("#vacancyPopupFormCompanyInput").val(company);
        }
      }

      $("body").addClass("overflow-hidden");
      $("#vacancyPopup").fadeIn(300);
    });

    function openSuccessPopup() {
      $("body").addClass("overflow-hidden");
      $("#thanksPopup").fadeIn(300);
    }

    $(".overlay-cdk, .overlay-cdk__inner").on("click", function (e) {
      if (e.target !== e.currentTarget) return;

      closePopup();
    });
    $(".overlay-cdk__close-btn").on("click", function () {
      closePopup();
    });
    function closePopup() {
      $("body").removeClass("overflow-hidden");
      $(".overlay-cdk").fadeOut(300);
      $(".youtube-video-place").html("");
    }

    // On page scroll
    // Sticky header
    if ($(".main-header").length) {
      let sticky = $(".main-header").height();

      if (window.pageYOffset > sticky) {
        $(".main-header").addClass("sticky main-header--sticky-dark");
      } else {
        $(".main-header").removeClass("sticky main-header--sticky-dark");
      }
    }

    // Sticky inner header
    let innerHeaderSticky = null;
    if ($(".inner-page-header").length) {
      let mainHeaderH = $(".main-header").outerHeight(true);
      innerHeaderSticky = $(".inner-page-header").offset().top;

      if (window.pageYOffset >= innerHeaderSticky) {
        $(".inner-page-header-wrap").height(
          $(".inner-page-header").outerHeight(true),
        );
        $(".inner-page-header").css({
          position: "fixed",
          top: mainHeaderH + 10,
          "z-index": 100,
        });
      } else {
        $(".inner-page-header-wrap").height("auto");
        $(".inner-page-header").css({
          position: "",
          top: "",
          "z-index": "",
        });
      }
    }

    $(document).on("scroll", function () {
      // if ($(".main-header").length) {
      //   floatingHeaderUpdate();
      // }
      // Home floating bg trigger
      $(".h-parallax-object").each(function () {
        if ($(this).isInViewport()) {
          hParallaxObjectUpdate($(this));
        }
      });
      // Parallaxed content
      $(".v-parallax-object").each(function () {
        if ($(this).isInViewport()) {
          let stepType = "default";
          if ($(this).hasClass("step-wide")) {
            stepType = "wide";
          } else if ($(this).hasClass("step-big")) {
            stepType = "big-wide";
          }
          vParallaxObjectUpdate($(this), stepType);
        }
      });

      // Sticky header
      if ($(".main-header").length) {
        let sticky = $(".main-header").height();

        if (window.pageYOffset > sticky) {
          $(".main-header").addClass("sticky main-header--sticky-dark");
        } else {
          $(".main-header").removeClass("sticky main-header--sticky-dark");
        }
      }
      // Sticky inner header
      if ($(".inner-page-header").length) {
        let mainHeaderH = $(".main-header").outerHeight(true);

        if (window.pageYOffset >= innerHeaderSticky) {
          $(".inner-page-header-wrap").height(
            $(".inner-page-header").outerHeight(true),
          );
          $(".inner-page-header").css({
            position: "fixed",
            top: mainHeaderH + 10,
            "z-index": 100,
          });
        } else {
          $(".inner-page-header-wrap").height("auto");
          $(".inner-page-header").css({
            position: "",
            top: "",
            "z-index": "",
          });
        }
      }
    });

    // Home floating bg
    $(".h-parallax-object").each(function () {
      if ($(this).isInViewport()) {
        hParallaxObjectUpdate($(this));
      }
    });
    function hParallaxObjectUpdate($el) {
      let eposition = $el.offset().top;
      let sposition = $(document).scrollTop();
      let wheight = $(window).height();

      let slowMultiplier = 8;
      let offset = 5;
      let p =
        Math.floor(((eposition - sposition) / wheight) * 100) / slowMultiplier -
        offset;
      $el.css("transform", `translateX(${p}%)`);
    }

    $(".v-parallax-object").each(function () {
      if ($(this).isInViewport()) {
        vParallaxObjectUpdate($(this));
      }
    });
    function vParallaxObjectUpdate($el, type = "default") {
      let eposition = $el.offset().top;
      let sposition = $(document).scrollTop();
      let wheight = $(window).height();

      let slowMultiplier = 8;
      let offset = 5;
      let step = 2;
      if (type === "wide") {
        step = 3;
      }
      if (type === "big-wide") {
        step = 4;
      }

      let p =
        Math.floor(((eposition - sposition) / wheight) * step * 100) /
          slowMultiplier -
        offset;
      $el.css("transform", `translateY(${p}%)`);
    }

    // Contact map menu
    $(".contact-map-menu__item-btn").on("click", function (e) {
      e.preventDefault();
      const parent = $(this).closest(".contact-map-menu__item");
      const id = parent.data("id");

      if (!parent.hasClass("active")) {
        $(".contact-map-menu__item").removeClass("active");
        parent.addClass("active");

        $(".contact-map__part-wrap").removeClass("active");
        $(`.contact-map__part-wrap--${id}`).addClass("active");

        // Refactor later
        if (id === 1) {
          $(".contact-map-wrap").addClass("contact-map-wrap--focus-1");
        } else {
          $(".contact-map-wrap").removeClass("contact-map-wrap--focus-1");
        }
        if (id === 2) {
          $(".contact-map-wrap").addClass("contact-map-wrap--focus-2");
        } else {
          $(".contact-map-wrap").removeClass("contact-map-wrap--focus-2");
        }
        if (id === 3) {
          $(".contact-map-wrap").addClass("contact-map-wrap--focus-3");
        } else {
          $(".contact-map-wrap").removeClass("contact-map-wrap--focus-3");
        }
        if (id === 4) {
          $(".contact-map-wrap").addClass("contact-map-wrap--focus-4");
        } else {
          $(".contact-map-wrap").removeClass("contact-map-wrap--focus-4");
        }
      } else {
        $(".contact-map-menu__item").removeClass("active");

        $(".contact-map__part-wrap").removeClass("active");

        $(".contact-map-wrap").removeClass("contact-map-wrap--focus-1");
        $(".contact-map-wrap").removeClass("contact-map-wrap--focus-2");
        $(".contact-map-wrap").removeClass("contact-map-wrap--focus-3");
        $(".contact-map-wrap").removeClass("contact-map-wrap--focus-4");
      }
    });
    $(".contact-map__part-btn").on("click", function (e) {
      e.preventDefault();
      const id = $(this).data("id");
      const menuItem = $(`.contact-map-menu__item[data-id='${id}']`);
      menuItem.find(".contact-map-menu__item-btn").trigger("click");
    });

    // File input change handler / File input name
    $(
      "#presentationSectionFormFileInput, #vacancySectionFormFileInput, #vacancyPopupFormFileInput",
    ).on("change", function (e) {
      $(".contact-form__file-name").html("").addClass("d-none");

      let name = $(this)[0].files[0].name;
      if (name) {
        $(".contact-form__file-name")
          .html(`<small>${name}</small>`)
          .removeClass("d-none");
      }
    });

    // Vacancy section form
    $(".open-vacancy-section-form-file-input").on("click", function (e) {
      e.preventDefault();

      $("#vacancySectionFormFileInput").trigger("click");
    });

    $("#vacancySectionFormFileInput").on("change", function (e) {
      let name = null;
      if (this.files.length) {
        if (this.files[0].size > 10485760) {
          alert("Максимальный размер файла: 10 МБ");
          $(this).val("");
        }

        name = this.files[0].name;
      }
    });

    // Vacancy popup form
    $(".open-vacancy-popup-form-file-input").on("click", function (e) {
      e.preventDefault();

      $("#vacancyPopupFormFileInput").trigger("click");
    });

    $("#vacancyPopupFormFileInput").on("change", function (e) {
      let name = null;
      if (this.files.length) {
        if (this.files[0].size > 10485760) {
          alert("Максимальный размер файла: 10 МБ");
          $(this).val("");
        }

        name = this.files[0].name;
      }
    });

    // Presentation section form
    $(".open-presentation-section-form-file-input").on("click", function (e) {
      e.preventDefault();

      $("#presentationSectionFormFileInput").trigger("click");
    });

    $("#presentationSectionFormFileInput").on("change", function (e) {
      let name = null;
      if (this.files.length) {
        if (this.files[0].size > 10485760) {
          alert("Максимальный размер файла: 10 МБ");
          $(this).val("");
          // $("#vacancySectionFormFileInputName").html("");
        }

        name = this.files[0].name;
      }
    });

    // Out of bound swiper containers
    let containerToRight =
      $(window).outerWidth(true) -
      ($(".container").offset().left + $(".container").outerWidth() - 35);
    $(".out-of-bound-sw").css("margin-right", `-${containerToRight}px`);
    $(".out-of-bound-sw").css("margin-left", `-${containerToRight}px`);
    $(".out-of-bound-sw .swiper-container").css(
      "padding-left",
      `${containerToRight}px`,
    );
    $(".out-of-bound-sw .swiper-container").css("padding-right", `50px`);

    // Text spoiler
    $(".text-spoiler__btn").on("click", function (e) {
      e.preventDefault();

      const $parent = $(this).closest(".text-spoiler");
      const $content = $parent.find(".text-spoiler__content");

      $parent.addClass("active");
      $content.css("max-height", $content[0].scrollHeight);
    });

    $(window).on("resize", function () {
      containerToRight =
        $(window).outerWidth(true) -
        ($(".container").offset().left + $(".container").outerWidth() - 35);

      $(".out-of-bound-sw").css("margin-right", `-${containerToRight}px`);
      $(".out-of-bound-sw").css("margin-left", `-${containerToRight}px`);
      $(".out-of-bound-sw .swiper-container").css(
        "padding-left",
        `${containerToRight}px`,
      );
      $(".out-of-bound-sw .swiper-container").css("padding-right", `50px`);

      // Text spoiler
      if ($(".text-spoiler").length) {
        $(".text-spoiler").each(function () {
          if ($(this).hasClass("active")) {
            const $parent = $(this).closest(".text-spoiler");
            const $content = $parent.find(".text-spoiler__content");

            $content.css("max-height", $content[0].scrollHeight);
          }
        });
      }
    });

    if ($(".service-swiper").length) {
      $(".service-swiper").each(function () {
        const arrowPrev = $(this)
          .closest(".service-swiper-wrap")
          .find(".swiper-button-prev")[0];

        const arrowNext = $(this)
          .closest(".service-swiper-wrap")
          .find(".swiper-button-next")[0];

        new Swiper($(this)[0], {
          // navigation: {
          //   nextEl: arrowNext,
          //   prevEl: arrowPrev,
          // },
          slidesPerView: "auto",
          spaceBetween: 20,
          freeMode: true,
          updateOnWindowResize: true,
          // breakpoints: {
          //   768: {
          //     slidesPerView: 2,
          //   },
          //   992: {
          //     slidesPerView: 3,
          //   },
          // },
        });
      });
    }

    if ($(".partner-swiper").length) {
      $(".partner-swiper").each(function () {
        const arrowPrev = $(this)
          .closest(".partner-swiper-wrap")
          .find(".swiper-button-prev")[0];

        const arrowNext = $(this)
          .closest(".partner-swiper-wrap")
          .find(".swiper-button-next")[0];

        new Swiper($(this)[0], {
          // navigation: {
          //   nextEl: arrowNext,
          //   prevEl: arrowPrev,
          // },
          slidesPerView: "auto",
          spaceBetween: 20,
          freeMode: true,
          updateOnWindowResize: true,
          // breakpoints: {
          //   768: {
          //     slidesPerView: 3,
          //   },
          //   992: {
          //     slidesPerView: 5,
          //   },
          // },
        });
      });
    }

    if ($(".contact-swiper").length) {
      $(".contact-swiper").each(function () {
        const arrowPrev = $(this)
          .closest(".contact-swiper-wrap")
          .find(".swiper-button-prev")[0];

        const arrowNext = $(this)
          .closest(".contact-swiper-wrap")
          .find(".swiper-button-next")[0];

        new Swiper($(this)[0], {
          // navigation: {
          //   nextEl: arrowNext,
          //   prevEl: arrowPrev,
          // },
          slidesPerView: "auto",
          spaceBetween: 20,
          freeMode: true,
          updateOnWindowResize: true,
          // breakpoints: {
          //   768: {
          //     slidesPerView: 3,
          //   },
          //   992: {
          //     slidesPerView: 4,
          //   },
          // },
        });
      });
    }

    if ($(".news-swiper").length) {
      $(".news-swiper").each(function () {
        const arrowPrev = $(this)
          .closest(".news-swiper-wrap")
          .find(".swiper-button-prev")[0];

        const arrowNext = $(this)
          .closest(".news-swiper-wrap")
          .find(".swiper-button-next")[0];

        new Swiper($(this)[0], {
          // navigation: {
          //   nextEl: arrowNext,
          //   prevEl: arrowPrev,
          // },
          slidesPerView: "auto",
          spaceBetween: 20,
          freeMode: true,
          updateOnWindowResize: true,
          // breakpoints: {
          //   768: {
          //     slidesPerView: 3,
          //   },
          //   992: {
          //     slidesPerView: 4,
          //   },
          // },
        });
      });
    }
  });

  $.fn.isInViewport = function (sFix = false) {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();

    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    // don't remember what was the problem, but this one fixed it, sFix implemented only for this reason
    if (elementTop === 0 && sFix) {
      return false;
    }

    return elementBottom > viewportTop && elementTop < viewportBottom;
  };
})(jQuery);

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}
