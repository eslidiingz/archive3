import { useEffect } from "react";
import Mainlayout from "../../components/layouts/Mainlayout";
import TabContainer from 'react-bootstrap/TabContainer'
import Link from "next/link";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import React from "react";


const TabWhitepaper = () => {
 
  return (
    <>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <div className="d-lg-none layout-menu-tab_WP-m">
              <Row>
                <Col className="col-12">
                    <p className="text-tap-left_wp">White Paper</p>
                    <p className="text-tap-menu_wp">Menu</p>
                    <hr/>
                </Col>
              <Nav variant="pills">
                  <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="first"><span className="oneline-dot">About Project</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="second"><span className="oneline-dot">Future Food Future Crop</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="three"><span className="oneline-dot">MG NFT MEMBER CLUB</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="four"><span className="oneline-dot">Benefits of CNB  token</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="five"><span className="oneline-dot">How is it better than other types of inves...</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="six"><span className="oneline-dot">Sale</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="seven"><span className="oneline-dot">MG Marketplace</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="eight"><span className="oneline-dot">Road mapp</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="nine"><span className="oneline-dot">Future Food Future Crop</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    <Col md={3} sm={4} className="col-12">
                    <Nav.Item>
                        <Nav.Link eventKey="ten"><span className="oneline-dot">Partnership</span></Nav.Link>
                    </Nav.Item>
                    </Col>
                    </Nav>
              </Row>
              </div>

            <Row>
                <Col xxl={3} xl={4} lg={4} className="layout-tap-left_WP d-xxl-block d-xl-block d-lg-block d-none">
                    <p className="text-tap-left_wp">White Paper</p>
                    <p className="text-tap-menu_wp">Menu</p>
                    <hr/>
                <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                    <Nav.Link eventKey="first"><span className="oneline-dot">About Project</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="second"><span className="oneline-dot">Future Food Future Crop</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="three"><span className="oneline-dot">MG NFT MEMBER CLUB</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="four"><span className="oneline-dot">Benefits of CNB  token</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="five"><span className="oneline-dot">How is it better than other types of inves...</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="six"><span className="oneline-dot">Sale</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="seven"><span className="oneline-dot">MG Marketplace</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="eight"><span className="oneline-dot">Road mapp</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="nine"><span className="oneline-dot">Future Food Future Crop</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="ten"><span className="oneline-dot">Partnership</span></Nav.Link>
                    </Nav.Item>
                </Nav>
                </Col>
                <Col xxl={9} className="custum-col">
                <Tab.Content>
                    <Tab.Pane eventKey="first">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">About Project</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">Future Food Future Crop</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="three">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">MG NFT MEMBER CLUB</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="four">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">Benefits of CNB  token</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="five">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">How is it better than other types of inves..</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="six">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">Sale</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="seven">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">MG Marketplace</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="eight">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">Road mapp</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="nine">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">Future Food Future Crop</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="ten">
                        <div className="row">
                            <div className="col-xxl-3">
                                <p className="text-tittle_WP">Partnership</p>
                            </div>
                            <div className="col-xxl-9">
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                                <p className="text-detail_WP">It started with the project of life improvement using Thai herbs together with the partner, Rajamangala University of Technology Isan, as the first project that brought the business applying the use of the Blockchain system to our daily lives, including further extension of the use of membership cards in purchasing goods and services for consumption in the future</p>
                            </div>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
                </Col>
            </Row>
            </Tab.Container>


      
    </>
  );
};

export default TabWhitepaper;
TabWhitepaper.layout = Mainlayout;
