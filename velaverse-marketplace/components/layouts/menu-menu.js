const MobileMenu = () => {
  return (
    <div
      className="fixed inset-0 flex z-40 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        aria-hidden="true"
      ></div>

      <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
        <div className="px-4 pt-5 pb-2 flex">
          <button
            type="button"
            className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-2">
          <div className="border-b border-gray-200">
            <div
              className="-mb-px flex px-4 space-x-8"
              aria-orientation="horizontal"
              role="tablist"
            >
              <button
                id="tabs-1-tab-1"
                className="text-gray-900 border-transparent flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                aria-controls="tabs-1-panel-1"
                role="tab"
                type="button"
              >
                Women
              </button>

              <button
                id="tabs-1-tab-2"
                className="text-gray-900 border-transparent flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                aria-controls="tabs-1-panel-2"
                role="tab"
                type="button"
              >
                Men
              </button>
            </div>
          </div>

          <div
            id="tabs-1-panel-1"
            className="pt-10 pb-8 px-4 space-y-10"
            aria-labelledby="tabs-1-tab-1"
            role="tabpanel"
            tabIndex="0"
          >
            <div className="space-y-4">
              <div className="group relative aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg"
                  alt="Models sitting back to back, wearing Basic Tee in black and bone."
                  className="object-center object-cover group-hover:opacity-75"
                />
                <div className="flex flex-col justify-end">
                  <div className="p-4 bg-white bg-opacity-60 text-base sm:text-sm">
                    <a href="#" className="font-medium text-gray-900">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      ></span>
                      New Arrivals
                    </a>
                    <p
                      aria-hidden="true"
                      className="mt-0.5 text-gray-700 sm:mt-1"
                    >
                      Shop now
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg"
                  alt="Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees."
                  className="object-center object-cover group-hover:opacity-75"
                />
                <div className="flex flex-col justify-end">
                  <div className="p-4 bg-white bg-opacity-60 text-base sm:text-sm">
                    <a href="#" className="font-medium text-gray-900">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      ></span>
                      Basic Tees
                    </a>
                    <p
                      aria-hidden="true"
                      className="mt-0.5 text-gray-700 sm:mt-1"
                    >
                      Shop now
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg"
                  alt="Model wearing minimalist watch with black wristband and white watch face."
                  className="object-center object-cover group-hover:opacity-75"
                />
                <div className="flex flex-col justify-end">
                  <div className="p-4 bg-white bg-opacity-60 text-base sm:text-sm">
                    <a href="#" className="font-medium text-gray-900">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      ></span>
                      Accessories
                    </a>
                    <p
                      aria-hidden="true"
                      className="mt-0.5 text-gray-700 sm:mt-1"
                    >
                      Shop now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p
                  id="women-shoes-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  Shoes &amp; Accessories
                </p>
                <ul
                  role="list"
                  aria-labelledby="women-shoes-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sneakers
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Boots
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Flats
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sandals
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Heels
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Socks
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p
                  id="women-collection-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  Shop Collection
                </p>
                <ul
                  role="list"
                  aria-labelledby="women-collection-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Everything
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Core
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      New Arrivals
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sale
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Accessories
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p
                  id="women-clothing-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  All Clothing
                </p>
                <ul
                  role="list"
                  aria-labelledby="women-clothing-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Basic Tees
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Artwork Tees
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Tops
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Bottoms
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Swimwear
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Underwear
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p
                  id="women-accessories-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  All Accessories
                </p>
                <ul
                  role="list"
                  aria-labelledby="women-accessories-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Watches
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Wallets
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Bags
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sunglasses
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Hats
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Belts
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p
                  id="women-brands-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  Brands
                </p>
                <ul
                  role="list"
                  aria-labelledby="women-brands-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Full Nelson
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      My Way
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Re-Arranged
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Counterfeit
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Significant Other
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            id="tabs-1-panel-2"
            className="pt-10 pb-8 px-4 space-y-10"
            aria-labelledby="tabs-1-tab-2"
            role="tabpanel"
            tabIndex="0"
          >
            <div className="space-y-4">
              <div className="group relative aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
                  alt="Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters."
                  className="object-center object-cover group-hover:opacity-75"
                />
                <div className="flex flex-col justify-end">
                  <div className="p-4 bg-white bg-opacity-60 text-base sm:text-sm">
                    <a href="#" className="font-medium text-gray-900">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      ></span>
                      Accessories
                    </a>
                    <p
                      aria-hidden="true"
                      className="mt-0.5 text-gray-700 sm:mt-1"
                    >
                      Shop now
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg"
                  alt="Drawstring top with elastic loop closure and textured interior padding."
                  className="object-center object-cover group-hover:opacity-75"
                />
                <div className="flex flex-col justify-end">
                  <div className="p-4 bg-white bg-opacity-60 text-base sm:text-sm">
                    <a href="#" className="font-medium text-gray-900">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      ></span>
                      New Arrivals
                    </a>
                    <p
                      aria-hidden="true"
                      className="mt-0.5 text-gray-700 sm:mt-1"
                    >
                      Shop now
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg"
                  alt="Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt."
                  className="object-center object-cover group-hover:opacity-75"
                />
                <div className="flex flex-col justify-end">
                  <div className="p-4 bg-white bg-opacity-60 text-base sm:text-sm">
                    <a href="#" className="font-medium text-gray-900">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      ></span>
                      Artwork Tees
                    </a>
                    <p
                      aria-hidden="true"
                      className="mt-0.5 text-gray-700 sm:mt-1"
                    >
                      Shop now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p
                  id="men-shoes-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  Shoes &amp; Accessories
                </p>
                <ul
                  role="list"
                  aria-labelledby="men-shoes-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sneakers
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Boots
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sandals
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Socks
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p
                  id="men-collection-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  Shop Collection
                </p>
                <ul
                  role="list"
                  aria-labelledby="men-collection-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Everything
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Core
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      New Arrivals
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sale
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p
                  id="men-clothing-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  All Clothing
                </p>
                <ul
                  role="list"
                  aria-labelledby="men-clothing-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Basic Tees
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Artwork Tees
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Pants
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Hoodies
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Swimsuits
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p
                  id="men-accessories-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  All Accessories
                </p>
                <ul
                  role="list"
                  aria-labelledby="men-accessories-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Watches
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Wallets
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Bags
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Sunglasses
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Hats
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Belts
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p
                  id="men-brands-heading-mobile"
                  className="font-medium text-gray-900"
                >
                  Brands
                </p>
                <ul
                  role="list"
                  aria-labelledby="men-brands-heading-mobile"
                  className="mt-6 flex flex-col space-y-6"
                >
                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Re-Arranged
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Counterfeit
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      Full Nelson
                    </a>
                  </li>

                  <li className="flow-root">
                    <a href="#" className="-m-2 p-2 block text-gray-500">
                      My Way
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 px-4 space-y-6">
          <div className="flow-root">
            <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
              Company
            </a>
          </div>

          <div className="flow-root">
            <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
              Stores
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 px-4">
          <a href="#" className="-m-2 p-2 flex items-center">
            <img
              src="https://tailwindui.com/img/flags/flag-canada.svg"
              alt=""
              className="w-5 h-auto block flex-shrink-0"
            />
            <span className="ml-3 block text-base font-medium text-gray-900">
              CAD
            </span>
            <span className="sr-only">, change currency</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
