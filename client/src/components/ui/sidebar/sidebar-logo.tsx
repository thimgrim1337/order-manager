import logo from '@/assets/imgs/devil-logo.svg';

export default function SideBarLogo() {
  return (
    <div className='flex items-center justify-center '>
      <img src={logo} className='h-24 w-24 '></img>
    </div>
  );
}
