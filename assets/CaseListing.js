$(function () {
    var btn = $('.doc_caselisting .case-listing .readmore-tip');
    btn.attr('href', '#load-more');
    btn.click(function () {
        var pageID    = $('body').attr('data-id');
        var caseCount = $(this).attr('data-count');

        $.get(
            '/AjaxTemplate/MoreCases',
            { 'id': pageID, 'skip': caseCount },
            function (data) {
                $('.case-listing .row').append(data);
                $(btn).hide();
                $(btn).off('click');
            }
        );

        return false;
    });
});