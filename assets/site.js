/*  ============================================================
		Safety measures
	============================================================ */
if (!window.console) console = { log: function () { } };

/*  ============================================================
		Preset variables
	============================================================ */
// For visibility-/breakpoint-testing
var visCheckPhone,
    visCheckTablet,
    visCheckDesktop;

/*  ============================================================
		Jquery Base
	============================================================ */
$(function () {
    // For visibility-/breakpoint-testing
    visCheckPhone = $('#vis-check-phone');
    visCheckTablet = $('#vis-check-tablet');
    visCheckDesktop = $('#vis-check-desktop');
	
	// Bot secure forms, in conjunction with umbraco form model!
    $('form').each(function () {
        var that = this;
        var validateCheckbox = function (i, el, ischeck) {
            var reqVal = $(el).attr('data-val-required');
            var reqMsg = $('span[data-valmsg-for=' + $(el).attr('id') + ']');
            console.log(reqMsg);
            if (typeof reqVal != 'undefined' && reqVal != null && !$(el).is(':checked')) {
                $(reqMsg).addClass('field-validation-error').show().html('<span><br />' + reqVal + '</span>');
                if (typeof ischeck === 'undefined' || ischeck === false)
                    return false;
            } else {
                $(reqMsg).removeClass('field-validation-error').hide().html('');
            }
        };
        var checkboxes = $(that).find('input[type=checkbox]');
	    $(that).append('<input value="' + new Date().getTime() + '" name="NoBotValidate" type="hidden" />');
	    $(that).submit(function () {
	        $(checkboxes).each(validateCheckbox);
	    });
	    $(checkboxes).change(function () {
	        validateCheckbox(0, this, true);
	    });
	});

	$('.superSlider').each(function () {
	    if ((isPhone() && typeof $(this).attr('data-superSlider-slides-phone') == "undefined")
            || (isTablet() && typeof $(this).attr('data-superSlider-slides-tablet') == "undefined")
            || (isDesktop() && typeof $(this).attr('data-superSlider-slides-desktop') == "undefined"))
	        return false;

	    var timeout = parseInt($(this).attr('data-superSlider-timeout')) || 0;

	    var numItems = (isPhone()
            ? $(this).attr('data-superSlider-slides-phone')
            : (isTablet()
            ? $(this).attr('data-superSlider-slides-tablet')
            : $(this).attr('data-superSlider-slides-desktop')));

	    var noNavigation = $(this).find('.item').length <= numItems;

	    if (noNavigation)
	        $($(this).attr('data-superSlider-prev') + ',' + $(this).attr('data-superSlider-next')).hide();
	    else
	        $($(this).attr('data-superSlider-prev') + ',' + $(this).attr('data-superSlider-next')).show();

	    $(this).cycle({
	        prev: $(this).attr('data-superSlider-prev'),
	        next: $(this).attr('data-superSlider-next'),
	        slides: '> .item',
	        fx: 'carousel',
	        timeout: noNavigation ? 0 : timeout,
	        swipe: true,
	        carouselVisible: numItems,
	        carouselFluid: true,
	        circular: true,
	        autoHeight: "calc",
	        allowWrap: ($(this).attr('data-superslider-allowwrap') == "false" ? false : true),
	        easing: 'linear'
	    });
	    if ($(this).find('.item:not(.cycle-sentinel)').length < 2)
	        $(this).parent().find('.browse').hide();
	});

    // Responsive menu toggle
	$('#siteMenuBtn').click(function () {
	    $('.top-banner').toggleClass("active");
	    $('.mainMenu').toggleClass("active");
	    $('.menuWrap').slideToggle();
	});

    /* Job listing filter */
	$("div.job-filter a.filter-item").click(function () {
	    $("div.job-filter a.filter-item").removeClass("active");
	    $(this).addClass("active");
	    var loc = $(this).attr("data-location");

	    $("div.job-listing").load("/AjaxTemplate/JobFilter?loc=" + loc);
	});

	$(".fancybox").fancybox({ maxWidth: 700 });

	$("p.spontaneous-intro-text a").click(function () {
	    $("#spontaneous-application").slideDown("fast");
	    return false;
	});
    readyNresize();
});

$(window).resize(function () {
    loadNresize();
    readyNresize();
});

$(window).load(function () {
    loadNresize();
    if (typeof window.shouldScrollTo !== 'undefined') {
        setTimeout(function () {
            var container = $('body');
            var scrollTo = $('#' + window.shouldScrollTo);
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        }, 1);
    }
});

/*  ============================================================
		Functions from wich all calls should come
	============================================================ */

function readyNresize() {
    responsiveImages();
    updateCaseHighlight();
    setTimeout(function () {
        alignHeightToHighest('.news-item');
        alignHeightToHighest('.case-item');
    }, 50);
}
function loadNresize() {
}


/*  ============================================================
		Functions for specific tasks
	============================================================ */
function alignHeight(base, target, breakpoints) {

    var max = 0;
    $(target).css("height", "auto");
    if (!((isDesktop() && breakpoints.desktop) || (isTablet() && breakpoints.tablet) || (isPhone() && breakpoints.mobile))) // Check breakpoint
        return false;

    $(base).each(function () {
        if ($(this).outerHeight() > max) {
            max = $(this).outerHeight();
        }
    });
    $(target).css("height", max);
}

function alignHeightToHighest(selector) {
    var max = 0;
    $(selector).css('height', 'auto');

    if (isPhone()) {
        return $(selector);
    }

    $(selector).each(function (ind, el) {
        if ($(this).outerHeight() > max) {
            max = $(this).outerHeight();
        }
    });
    return $(selector).css('height', max);
}


/*
	Flyttar obj till elementet target och lägger tillbaka med en append i obj orginal parent
	Ex: moveDiv(".logos2",".logos.hidden-desktop", {desktop:false,tablet:true,mobile:true});
*/
var movedDivs = 0;
function moveDiv(obj, target, breakpoints) {
    if ($(obj).length > 0 && $(target).length > 0 && ((isDesktop() && breakpoints.desktop) || (isTablet() && breakpoints.tablet) || (isPhone() && breakpoints.mobile))) // Check breakpoint
    {
        if (!$(obj).hasClass("moved")) // Has it moved already?
        {
            $(obj).after('<div class="movedPlaceholder_' + movedDivs + '"></div>');
            $(obj).addClass("moved").attr("placeholder-id", movedDivs);
            $(target).append($(obj));
            movedDivs++;
        }
    }
    else {
        if ($(obj).hasClass("moved")) // Returned moved objects
        {
            $(".movedPlaceholder_" + $(obj).attr("placeholder-id")).after($(obj)).remove();
            $(obj).removeClass("moved");
        }
    }
}


/****** Visibility-/breakpoint-testing
 ********************************/

function isPhone() {
    return visCheckPhone.is(':visible');
}

function isTablet() {
    return visCheckTablet.is(':visible');
}

function isDesktop() {
    return visCheckDesktop.is(':visible');
}


if (!Modernizr.input.placeholder) {
	$('[placeholder]').focus(function () {
		var input = $(this);
		if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		}
	}).blur(function () {
		var input = $(this);
		if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		}
	}).blur();

	$('[placeholder]').parents('form').submit(function () {
		$(this).find('[placeholder]').each(function () {
			var input = $(this); inpu
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			}
		})
	});

}

/*
 * Fix alt text to a small span beneath the image
 */
    
$(function () {
    $('span[class*="image-"]').each(function () {
        if ($(this).children("img").attr('alt').indexOf('.jpg') > -1 !== true) {
            $(this)
                .append('<div class="altText">' + $(this).children("img").attr('alt') + '</div>')
                .replaceWith('<div class="' + $(this).attr('class') + '">' + $(this).html() + '</div>');
        }
    });
});


/*
* ########################################
* #### Responsive
* ########################################
*/

function responsiveImages() {
    $('.responsive-image').each(function (ind, el) {
        var img;
        if (isPhone()) {
            img = $(el).attr('data-mobile-image');
        } else if (isTablet()) {
            img = $(el).attr('data-tablet-image');
        } else {
            img = $(el).attr('data-desktop-image');
        }
        if ($(el).attr('data-use-background') == 'true') {
            $(el).css("background-image", 'url(' + img + ')');
        } else {
            $(el).attr('src', img);
        }
        img = null;
    });
}

function updateCaseHighlight() {
    var repos = $('#highlight-reposition');
    var sent  = $(repos.attr('data-repos-sentinel'));
    var resp = $(repos.attr('data-repos-respect'));
    var newMargin = Math.floor((sent.height() - repos.height() - resp.outerHeight()) / 2);

    repos.css('padding', newMargin + 'px 0');
}

/* Analyticskod (ska ligga sist i denna fil)
* Vid lansering ändra UA_Code
*******************************/
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-55111982-1', 'auto');
ga('send', 'pageview');
ga('create', 'UA-41855247-1', 'auto', { 'name': 'nethouse' });
ga('nethouse.send', 'pageview');