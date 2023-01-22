import { Layout, Menu } from 'antd';
import Link from 'next/link'

const { Header } = Layout;

const Navbar = () => {

  return (
    <div>
      <Header>
        <div className="name">
          <Link href="/"><img src="/name.svg" alt="Logo" /></Link>
        </div>
      </Header>
      <Menu className='header' mode="horizontal">
        <Menu.Item key="1">
          <Link href="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link href="/about">About Us</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <a href="https://animalcharityevaluators.org/donation-advice/recommended-charities/" target="_blank">Donate</a>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Navbar;
