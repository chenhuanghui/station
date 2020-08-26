import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="description" content="CabinFood for Business" />

            <link rel="stylesheet" href="../assets/css/theme.min.css"></link>
            <link rel="stylesheet" href="../assets/css/style.css"></link>

            {/* <link rel="stylesheet" href="../assets/libs/highlightjs/styles/vs2015.css"></link> */}
            <link rel="stylesheet" href="../assets/css/flatpickr.min.css"></link>
            {/* <link rel="stylesheet" href="../assets/libs/quill/dist/quill.core.css"></link> */}
            <link rel="stylesheet" href="../assets/fonts/feather/feather.css"></link>

            {/* <script src="../assets/libs/jquery/dist/jquery.min.js"></script> */}
            {/* <script src="../assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js"></script> */}
            {/* <script src="../assets/libs/flatpickr/dist/flatpickr.min.js"></script> */}
            {/* <script src="../assets/libs/select2/dist/js/select2.full.min.js"></script> */}


            <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/7453021.js"></script>
            {/* GA-init */}
            {/* <script async src="https://www.googletagmanager.com/gtag/js?id=UA-168839658-1"></script> */}
          
          
        </Head>
        <body>
          <Main />
          <NextScript />
          <div className="modal-backdrop fade show"></div>
        </body>
      </Html>
    )
  }
}

export default MyDocument