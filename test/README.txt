"lib" folder - placeholder for general libraries that are used as for simple tests (qunit) and for integration tests (jasmine).
"jasmine" - behavior-driven testing framework (integration tests)
"qunit" - framework for simple tests

All libraries that are injected in production using cdnjs like:
    <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>
must be downloaded and placed to "lib" folder. Test must not use cdnjs.