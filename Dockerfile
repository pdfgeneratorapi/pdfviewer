FROM node:20 AS build-stage

RUN npm install -g gulp-cli
RUN git clone https://github.com/jevgeni-sultanov/pdf.js.git

# build pdf.js
WORKDIR /pdf.js
RUN git checkout develop
RUN npm install
RUN gulp generic
RUN gulp minified

# prepare build
RUN echo -n "Merge pdf.js build and web into one."
RUN cp -R build/generic/web ../viewer
RUN cp -R build/generic/build ../viewer
RUN echo " Done."

RUN echo -n "Fix relative URL's."
RUN sed -i \
    -e 's+../build/+../dist/+g' \
    build/generic/web/viewer.html
RUN sed -i \
    -e 's+../images/+../public/images/+g' \
    build/generic/web/viewer.css
RUN sed -i \
    -e 's+../build/pdf.worker.mjs+../public/pdf.worker.min.mjs+g' \
    -e 's+../build/pdf.sandbox.mjs+../public/pdf.sandbox.min.mjs+g' \
    -e 's+../web/+./+g' \
    -e 's+compressed.tracemonkey-pldi-09.pdf++g' \
    build/generic/web/viewer.mjs

RUN echo -n "Remove default files."
RUN rm build/generic/web/compressed.tracemonkey-pldi-09.pdf
RUN rm build/generic/web/debugger.mjs
RUN rm build/generic/web/debugger.css
RUN echo " Done."

# save result
FROM scratch AS export-stage
COPY --from=build-stage /pdf.js/build/generic/web/viewer.* /src/
COPY --from=build-stage /pdf.js/build/generic/web/cmaps /dist/cmaps/
COPY --from=build-stage /pdf.js/build/generic/web/images /dist/images/
COPY --from=build-stage /pdf.js/build/generic/web/standard_fonts /dist/standard_fonts/
COPY --from=build-stage /pdf.js/build/minified/build /public/
COPY --from=build-stage /pdf.js/node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid* /dist/webfonts/
