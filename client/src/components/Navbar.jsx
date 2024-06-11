import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Dropdown, Modal, FloatButton } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import "../styles/Navbar.css";
import ChatBox from './ChatBox';


const Navbar = ({ setIsUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const isInstructor = user && user.role === 'instructor';
    const isStudent = user && user.role === 'student';

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.pageYOffset > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showLogoutModal = () => setLogoutModalVisible(true);
    const handleCancelLogout = () => setLogoutModalVisible(false);

    

    const handleConfirmLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate('/login');
        setIsUser(false);
    };

    const userMenu = (
        <Menu className="user-menu">
            <Menu.Item key="1" icon={<UserOutlined />} className="user-menu-item">
                <div className="user-details">
                    {user && (
                        <>
                            <div className="user-detail"><strong>Full Name: </strong>{user.fullname}</div>
                            <div className="user-detail"><strong>Email: </strong>{user.email}</div>
                        </>
                    )}
                </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" icon={<LogoutOutlined />} onClick={showLogoutModal} className="logout-menu-item">
                <strong>Logout</strong>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <header className={`navbar-header ${isMenuOpen ? "navbar-open" : ""} ${isScrolled ? "navbar-sticky" : ""}`} id='nav-menu'>
                <Link to="/" className="navbar-logo" onClick={closeMenu}>Swarnirbhar</Link>
                <nav className={`navbar ${isMenuOpen ? "navbar-expanded" : ""}`}>
                    <Link to="/allCourses" className={`navbar-link ${location.pathname === "/allCourses" ? "active" : ""}`} onClick={closeMenu}>All Courses</Link>
                    {isInstructor && (
                        <>
                            <Link to="/assignment" className={`navbar-link ${location.pathname === "/assignment" ? "active" : ""}`} onClick={closeMenu}>Assignment</Link>
                        </>
                    )}
                    {isStudent && (
                        <>
                            <Link to="/myCourses" className={`navbar-link ${location.pathname === "/myCourses" ? "active" : ""}`} onClick={closeMenu}>My Courses</Link>
                            <Link to="/myAssignment" className={`navbar-link ${location.pathname === "/myAssignment" ? "active" : ""}`} onClick={closeMenu}>Assignment</Link>
                            <Link to="/mySubmission" className={`navbar-link ${location.pathname === "/mySubmission" ? "active" : ""}`} onClick={closeMenu}>Submissions</Link>
                        </>
                    )}
                    <Dropdown overlay={userMenu} className="user-dropdown" placement="bottom">
                        <a className="dropdown-link" onClick={e => e.preventDefault()}>
                            <i className="fa-solid fa-user-tie"></i>
                        </a>
                    </Dropdown>
                </nav>
                <i className="fa-solid fa-bars navbar-menu-icon" onClick={toggleMenu}></i>
                <Modal
                    title="Confirm Logout"
                    style={{ top: 50 }}
                    visible={logoutModalVisible}
                    onOk={handleConfirmLogout}
                    onCancel={handleCancelLogout}
                    okText="Logout"
                    cancelText="Cancel"
                >
                    Are you sure you want to logout?
                </Modal>
            </header>

            <FloatButton description="Ask" style={{ fontWeight: 800 }} onClick={() => setModalVisible(true)} />
            {modalVisible && <ChatBox onClose={() => setModalVisible(false)} />}
        </>
    );
};

export default Navbar;
