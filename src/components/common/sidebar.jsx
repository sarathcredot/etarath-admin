import React from "react";
import { Link, useLocation } from "react-router-dom";
// import withRouter from 'react-router-dom/withRouter';
import SlideToggle from "react-slide-toggle";

import menuData from "../../utils/data/menu.json";
import sideBarItems from "../../utils/data/sidebarItems.json";
import withRouter from "./WithRouter";
import { GiCartwheel, GiCarWheel } from "react-icons/gi";
import { PiTireLight, PiTireBold } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbBrand4Chan } from "react-icons/tb";
import { RiCustomerService2Line } from "react-icons/ri";
import { BsTag } from "react-icons/bs";
import { FaPersonShelter } from "react-icons/fa6";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import { MdOutlineSettingsSuggest } from "react-icons/md";




const iconsMap = {
  GiCartwheel,
  PiTireLight,
  PiTireBold,
  LuLayoutDashboard,
  TbBrand4Chan,
  RiCustomerService2Line,
  BsTag,
  FaPersonShelter,
  MdOutlineDashboardCustomize,
  LuShoppingCart,
  MdOutlineSettingsSuggest
};
function Sidebar(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  function toggleSidebar() {
    document.querySelector("html").classList.toggle("sidebar-left-collapsed");
  }

  function getOpenState(item) {
    return !item.children.find(
      (child) =>
        child.url === currentPath ||
        (child.children &&
          child.children.find((sub) => sub.url === currentPath))
    );
  }

  function closeSiblings(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.classList.contains("expanded")) return;

    let menu = e.currentTarget.closest("ul");
    let openedLink = menu.querySelector("li > a.expanded");
    openedLink && openedLink.click();
  }

  return (
    <aside
      id="sidebar-left"
      className="sidebar-left"
      // style={{ background: "#000" }}
    >
      <div className="sidebar-header">
        <div className="sidebar-title">Navigation</div>
        <div
          className="sidebar-toggle d-none d-md-block"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars" aria-label="Toggle sidebar"></i>
        </div>
      </div>

      <div
        className="nano"
        // style={{ background: "#000" }}
      >
        <div className="nano-content">
          <nav id="menu">
            <ul className="nav nav-main">
              {sideBarItems.map((item, index) => (
                <li
                  className={item.children ? "nav-parent" : ""}
                  key={`dropdown-${index}`}
                >
                  {item.children ? (
                    <>
                      <SlideToggle collapsed={getOpenState(item)}>
                        {({ onToggle, setCollapsibleElement, toggleState }) => (
                          <>
                            <a
                              href="#no"
                              className={`nav-link ${
                                toggleState === "EXPANDED" ||
                                toggleState === "EXPANDING"
                                  ? "expanded"
                                  : ""
                              }`}
                              onClick={(e) => {
                                closeSiblings(e);
                                onToggle();
                              }}
                            >
                              {/* <i className={item.icon}></i> */}
                              {item.icon.startsWith("bx") ? (
                                <i
                                  className={item.icon}
                                  style={{ fontSize: "22px" }}
                                ></i>
                              ) : // if it's react-icon string, grab from map
                              iconsMap[item.icon] ? (
                                React.createElement(iconsMap[item.icon], {
                                  className: "text-white mr-3",
                                  size: "20px",
                                })
                              ) : null}
                              <span>{item.name}</span>
                            </a>

                            <div
                              className="overflow-hidden"
                              ref={setCollapsibleElement}
                            >
                              <ul className="nav nav-children">
                                {item.children.map((subMenu, subId) => (
                                  <li
                                    className={
                                      subMenu.children
                                        ? "nav-parent"
                                        : subMenu.url === currentPath
                                        ? "active"
                                        : ""
                                    }
                                    key={`dropdown-${index}-${subId}`}
                                  >
                                    {subMenu.children ? (
                                      <SlideToggle
                                        collapsed={getOpenState(subMenu)}
                                      >
                                        {({
                                          onToggle,
                                          setCollapsibleElement,
                                          toggleState,
                                        }) => (
                                          <>
                                            <a
                                              href="#no"
                                              className={`nav-link ${
                                                toggleState === "EXPANDED" ||
                                                toggleState === "EXPANDING"
                                                  ? "expanded"
                                                  : ""
                                              }`}
                                              onClick={(e) => {
                                                closeSiblings(e);
                                                onToggle();
                                              }}
                                            >
                                              {subMenu.name}
                                            </a>
                                            <div
                                              className="overflow-hidden"
                                              ref={setCollapsibleElement}
                                            >
                                              <ul className="nav nav-children">
                                                {subMenu.children.map(
                                                  (ssubMenu, ssubId) => (
                                                    <li
                                                      key={`dropdown-${index}-${subId}-${ssubId}`}
                                                      className={
                                                        ssubMenu.url ===
                                                        currentPath
                                                          ? "active"
                                                          : ""
                                                      }
                                                    >
                                                      <Link
                                                        to={
                                                          process.env
                                                            .PUBLIC_URL +
                                                          ssubMenu.url
                                                        }
                                                        className="nav-link"
                                                      >
                                                        {ssubMenu.name}
                                                      </Link>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          </>
                                        )}
                                      </SlideToggle>
                                    ) : (
                                      <Link
                                        to={
                                          process.env.PUBLIC_URL + subMenu.url
                                        }
                                        className="nav-link"
                                      >
                                        {subMenu.name}
                                      </Link>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </SlideToggle>
                    </>
                  ) : (
                    <Link
                      to={process.env.PUBLIC_URL + item.url}
                      className="nav-link "
                    >
                      {item.icon.startsWith("bx") ? (
                        <i
                          className={item.icon}
                          style={{ fontSize: "22px" }}
                        ></i>
                      ) : // if it's react-icon string, grab from map
                      iconsMap[item.icon] ? (
                        React.createElement(iconsMap[item.icon], {
                          className: "text-white mr-3",
                          size: "20px",
                        })
                      ) : null}
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default withRouter(Sidebar);



// side bar all options

// [
//   
//   {
//     "name": "Vendors",
//     "icon": "FaPersonShelter",
//     "url": "/vendors"
//   },
//   {
//     "name": "Retailers",
//     "icon": "bx bx-group",
//     "url": "/retailers"
//   },
//   {
//     "name": "Products",
//     "icon": "LuShoppingCart",
//     "url": "/products"
//   },
//   {
//     "name": "Brands",
//     "icon": "MdOutlineDashboardCustomize",
//     "url": "/brands"
//   },

//   {
//     "name": "Attributes",
//     "icon": "BsTag",
//     "url": "#",
//     "children": [
//       {
//         "name": "Origin",
//         "url": "/attributes/origin"
//       },
//       {
//         "name": "Year",
//         "url": "/attributes/year_of_manufacture"
//       }
//     ]
//   },
//   {
//     "name": "Subscriptions",
//     "icon": "bx bx-package",
//     "url": "#",
//     "children": [
//       {
//         "name": "Vendor Plans",
//         "url": "/subscriptions/vendor-plans"
//       },
//       {
//         "name": "Retailer Plans",
//         "url": "/subscriptions/retailer-plans"
//       }
//     ]
//   },
//   {
//     "name": "CMS",
//     "icon": "MdOutlineSettingsSuggest",
//     "url": "#",
//     "children": [
//       {
//         "name": "Offers",
//         "url": "/cms/offers"
//       },
//       {
//         "name": "Blogs",
//         "url": "#",
//         "children": [
//           {
//             "name": "All Blogs",
//             "url": "/cms/blogs"
//           },
//           {
//             "name": "Categories",
//             "url": "/cms/blogs/categories"
//           },
//           {
//             "name": "Tags",
//             "url": "/cms/blogs/tags"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Customer Supports",
//     "icon": "RiCustomerService2Line",
//     "url": "#",
//     "children": [
//       {
//         "name": "Vendor",
//         "url": "/customer-supports/vendor"
//       },
//       {
//         "name": "Retailer",
//         "url": "/customer-supports/retailer"
//       }
//     ]
//   }
// ]

















// side bar child items json file

// {
//     "name": "Clipboard",
//     "icon": "bx bx-images",
//     "url": "#",
//     "children": [
//       {
//         "name": "Logos",
//         "url": "/clipboard/logos"
//       },
//       {
//         "name": "Banners",
//         "url": "/clipboard/banners"
//       }
//     ]
//   },
//   {
//     "name": "Posters",
//     "icon": "bx bx-images",
//     "url": "#",
//     "children": [
//       {
//         "name": "Announcement",
//         "url": "#",
//         "children": [
//           {
//             "name": "Tournament",
//             "url": "/posters/tournament-announcement"
//           },
//           {
//             "name": "Match Day",
//             "url": "/posters/match_day_announcement"
//           },
//           {
//             "name": "Auction",
//             "url": "/posters/auction-announcement"
//           }
//         ]
//       },
//       {
//         "name": "Team",
//         "url": "#",
//         "children": [
//           {
//             "name": "Team Registration",
//             "url": "/posters/team-registration"
//           },
//           {
//             "name": "Team poster",
//             "url": "/posters/team"
//           }
//         ]
//       },
//       {
//         "name": "Player",
//         "url": "#",
//         "children": [
//           {
//             "name": "Player Registration",
//             "url": "/posters/player-registration"
//           },
//           {
//             "name": "MOTM",
//             "url": "/posters/motm"
//           },
//           {
//             "name": "POT",
//             "url": "/posters/pot"
//           }
//         ]
//       },
//       {
//         "name": "Winner",
//         "url": "#",
//         "children": [
//           {
//             "name": "Champions",
//             "url": "/posters/champions"
//           },
//           {
//             "name": "Runner-Up",
//             "url": "/posters/runner_up"
//           }
//         ]
//       }
//     ]
//   }
