document.addEventListener('DOMContentLoaded', () =>
wait(500).then(() => {
    document.getElementById("result").style.display = "inline-block"
    $(document).ready(function(){
        $('.counter-value').each(function(){
            $(this).prop('Counter',0).animate({
                Counter: $(this).text()
            },{
                duration: 2500,
                easing: 'swing',
                step: function (now){
                    $(this).text(Math.ceil(now));
                }
            });
        });
    });
}));