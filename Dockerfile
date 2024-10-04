FROM node:20 AS build-stage

RUN npm install -g gulp-cli
RUN git clone --recurse-submodules https://github.com/pdfgeneratorapi/pdf.js.git

# build pdf.js
WORKDIR /pdf.js
RUN git submodule update --init --recursive
RUN npm install
RUN gulp generic
RUN gulp minified

# prepare build
RUN cp -R build/generic/web ../viewer
RUN cp -R build/generic/build ../viewer

RUN sed -i \
    -e 's+../build/+../dist/+g' \
    -e 's/\xEF\xBB\xBF//g' \
    build/generic/web/viewer.html
RUN sed -i \
    -e 's+../build/pdf.worker.mjs+../dist/pdf.worker.min.mjs+g' \
    -e 's+../build/pdf.sandbox.mjs+../dist/pdf.sandbox.min.mjs+g' \
    -e 's+../web/+./+g' \
    -e 's+compressed.tracemonkey-pldi-09.pdf++g' \
    build/generic/web/viewer.mjs

# remove unused files
RUN rm build/generic/web/compressed.tracemonkey-pldi-09.pdf
RUN rm build/generic/web/debugger.mjs
RUN rm build/generic/web/debugger.css

# export result
FROM scratch AS export-stage
COPY --from=build-stage /pdf.js/build/generic/web/viewer.* /src/
COPY --from=build-stage /pdf.js/build/generic/web/cmaps/ /dist/cmaps/
COPY --from=build-stage /pdf.js/build/generic/web/standard_fonts/ /dist/standard_fonts/
COPY --from=build-stage /pdf.js/build/minified/build /dist/
