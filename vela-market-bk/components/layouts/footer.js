const Footer = () => {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="bg-gray-200"
      id="footer"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto px-2 sm:px-4">
        {/* <div className="py-20 grid grid-cols-2 gap-8 sm:gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid grid-cols-1 gap-y-10 lg:col-span-2 lg:grid-cols-2 lg:gap-y-0 lg:gap-x-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Account</h3>
              <ul role="list" className="mt-6 space-y-6">
                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Manage Account
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Saved Items
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Orders
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Redeem Gift card
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Service</h3>
              <ul role="list" className="mt-6 space-y-6">
                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Shipping &amp; Returns
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Warranty
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    FAQ
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Find a store
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Get in touch
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-10 lg:col-span-2 lg:grid-cols-2 lg:gap-y-0 lg:gap-x-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Company</h3>
              <ul role="list" className="mt-6 space-y-6">
                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Who we are
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Press
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Careers
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Terms &amp; Conditions
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Connect</h3>
              <ul role="list" className="mt-6 space-y-6">
                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Instagram
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Pinterest
                  </a>
                </li>

                <li className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-600">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div> */}

        <div className="py-6 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <p>Shipping to Canada ($CAD)</p>
            <p className="ml-3 border-l border-gray-200 pl-3">English</p>
          </div>
          <p className="mt-6 text-sm text-gray-500 text-center sm:mt-0">
            &copy; 2021 Clothing Company, Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
