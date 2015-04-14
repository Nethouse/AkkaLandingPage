$(function () {
    var btn = $('.news-list .load-more-news');
    btn.attr('href', '#load-more');
    btn.click(function () {
        var pageID = $(this).attr('data-parent');
        var start = +$(this).attr('data-start');
        var max = +$(this).attr('data-max');
        var year = $(this).attr('data-year');
        $(this).attr('data-start', start + max);
        console.log(start + " " + max + " " + year);
        $.get(
            '/AjaxTemplate/MoreNews',
            { 'id': pageID, 'skip': start, 'year': year, 'max': max },
            function (data) {
                var dataEls = $(data);
                $('.news-container').append(dataEls);
                readyNresize();
                if (dataEls.find('.news-listing-ended').length > 0) {
                    $(btn).hide();
                    $(btn).off('click');
                }
            }
        );

        return false;
    });
});