import { Layout, Menu } from 'antd';
import Link from 'next/link'

const { Header } = Layout;

const Navbar = () => {

  return (
    <div>
    <Header>
      <div className="name">
        <img src="/name.svg" alt="Logo" />
      </div>      
    </Header>
    <Menu className='header' mode="horizontal">
        <Menu.Item key="1">
          <Link legacyBehavior href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link legacyBehavior href="/about">
            <a>About Us</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <a href="https://animalcharityevaluators.org/donation-advice/recommended-charities/" target="_blank">Donate</a>
        </Menu.Item>
      </Menu>
      </div>
  );
};

export default Navbar;
