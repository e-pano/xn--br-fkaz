        window.onscroll = function() {scrollFunction()};

        function scrollFunction() {
            let scrollTopBtn = document.getElementById("scrollTopBtn");
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        }

        function scrollToTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }

        document.addEventListener("DOMContentLoaded", function() {
            let rows = document.querySelectorAll("tr[data-mw]");
            let highestMwRow = null;
            let highestMw = 0;

            rows.forEach(row => {
                let mwValue = parseFloat(row.getAttribute("data-mw"));
                if (mwValue > highestMw) {
                    highestMw = mwValue;
                    highestMwRow = row;
                }
            });

            if (highestMw >= 5 && highestMwRow) {
                highestMwRow.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });