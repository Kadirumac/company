/* Sticky Navigation */
$(function() {

    var sticky = $('.sticky');
    var contentOffset;
    var nav_height;

    if (sticky.length) {

        if (sticky.data('offset')) {
            contentOffset = sticky.data('offset');
        } else {
            contentOffset = sticky.offset().top;
        }
        nav_height = sticky.height();
    }

    var scrollTop = $(window).scrollTop();
    var window_height = $(window).height();
    var doc_height = $(document).height();

    $(window).bind('resize', function() {
        scrollTop = $(window).scrollTop();
        window_height = $(window).height();
        doc_height = $(document).height();
        navHeight();
    });

    $(window).bind('scroll', function() {
        stickyNav();
    });

    function navHeight() {
        sticky.css('max-height', window_height + 'px');
    }

    function stickyNav() {
        scrollTop = $(window).scrollTop();
        if (scrollTop > contentOffset) {
            sticky.addClass('fixed');
        } else {
            sticky.removeClass('fixed');
        }
    }

});

$('document').ready(function() {
    var nav_height = 70;

    $("a[data-role='smoothscroll']").click(function(e) {
        e.preventDefault();

        var position = $($(this).attr("href")).offset().top - nav_height;

        $("body, html").animate({
            scrollTop: position
        }, 1000);
        return false;
    });
});

$('document').ready(function() {
    // Back to top
    var backTop = $(".back-to-top");

    $(window).scroll(function() {
        if ($(document).scrollTop() > 400) {
            backTop.css('visibility', 'visible');
        } else if ($(document).scrollTop() < 400) {
            backTop.css('visibility', 'hidden');
        }
    });

    backTop.click(function() {
        $('html').animate({
            scrollTop: 0
        }, 1000);
        return false;
    });
});


$('document').ready(function() {

    // Loader
    $(window).on('load', function() {
        $('.loader-container').fadeOut();
    });

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Popovers
    $('[data-toggle="popover"]').popover();

    // Page scroll animate
    new WOW().init();
});

$('document').ready(function() {
    $('#testimonials').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
    });
});


/*
 *  Counter
 *
 *  Require(" jquery.animateNumber.min.js ", " jquery.waypoints.min.js ")
 */
$(document).ready(function() {
    var counterInit = function() {
        if ($('.counter-section').length > 0) {
            $('.counter-section').waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {

                    var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
                    $('.number').each(function() {
                        var $this = $(this),
                            num = $this.data('number');
                        $this.animateNumber({
                            number: num,
                            numberStep: comma_separator_number_step
                        }, 5000);
                    });

                }

            }, { offset: '95%' });
        }

    }

    counterInit();
});

$("#myModal").on('hidden.bs.modal', function(e) {
    $("#myModal iframe").attr("src", $("#myModal iframe").attr("src"));
});

// The current slide
var slideOrder = 0;

// Pause between slides in miliseconds
var slidePause = 8000;

// The slides array
var slides = $(".card-decks .card-deck");

$(document).ready(function() {
    nextSlide(slideOrder)
})

function autoSlide() {
    autoSlideTimeout = setTimeout(function() {

        // Check if the slideOrder is not bigger
        // than the available amount of slides
        if (slides.length <= slideOrder) {
            slideOrder = 0;
        }

        // Give us the next slide
        nextSlide(slideOrder);


        slideOrder++;
    }, slidePause);
}

function theDelay(index) {
    // Maybe a bit dirty but we need to get the exact
    // pause between all the slides and we dont want a
    // point in the variable because of css
    var delay = (0.2 * index)
    var delayClass = parseInt(delay.toString().replace(".", ""));

    return "0" + delayClass
}

function nextSlide(deck) {
    //	Find the current active deck
    var currentDeck = slides.closest(".deck-active")
    var currentCards = currentDeck.find(".card");

    // Find the target deck we want to load in
    var nextDeck = slides.eq(deck);

    currentCards.each(function(index) {
        var delay = theDelay(index);
        var card = $(this)
            // Remove all the animate.css classess
        card.removeClass().attr('class', 'card');



        card.addClass("animated flipOutY fast delay-" + delay + "s");
        setTimeout(function() {
            card.find(".card-img-overlay").fadeOut();
            card.find(".card-img").removeAttr('style');
        }, ((delay + 8) * 50))


    });

    //	Animate.css class "fast" is timed for 0.8s
    //	we delay each CARD (not card-deck) intro by 0.2s 
    // so 0.8 + 0.2 = 1s
    //
    // 1 times each card without the first one * 1000
    // = the amount of seconds we have to wait before the new
    // we end this function
    //
    // I didn't remove the 1 because of the explanation
    var timeout = ((1 * (currentCards.length - 1)) * 1000)

    setTimeout(function() {
        if (nextDeck.length) {
            // Hide the current deck so the new deck
            // gets the right position then clean the
            // current deck
            currentDeck.removeClass("deck-active");
            currentDeck.find(".card").each(function() {
                $(this).removeClass().attr('class', 'card');
            })

            nextDeck.find(".card").each(function(index) {
                var delay = theDelay(index);

                var card = $(this);
                setTimeout(function() {
                    card.find(".card-img-overlay").stop().fadeIn();
                    card.find(".card-img").animate({ height: '110%', width: '110%' }, { duration: (slidePause / 2), easing: 'swing', queue: false });

                }, ((delay + 8) * 10))
                card.addClass("animated flipInY fast delay-" + delay + "s");




            })
            nextDeck.addClass("deck-active");
            autoSlide();
        } else {
            // Try to reset the process
            console.error("Card flipper, did not find the target deck. Did you remove it?")
            slideOrder = 0;
            autoSlide();
        }

    }, timeout)
}