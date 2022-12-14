import {useState, useEffect} from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Filter7TwoToneIcon from '@mui/icons-material/Filter7TwoTone';

import { useRouter } from 'next/router';
import { useCookies } from "react-cookie"
import { parseCookies } from "../utils/index";
import jwt from "jsonwebtoken";
import Link from "next/link";

const pages = ['politics', 'sport', 'events', 'news'];

function Navbar({authorization}) {

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)
  const [cookie, setCookie, removeCookie] = useCookies(["Bearer"])

  let userExists = "Bearer" in cookie;

  const jwtUser = jwt.decode(cookie.Bearer)


  useEffect(() => {
    if(jwtUser?.roles === "admin"){
      setIsAdmin(true)
    }
  }, [])



  useEffect(() => {
    userExists ? setAuth(true) : setAuth(false)
  },[userExists])


  const router = useRouter();


  const handleLogOut = async () => {
    const res = await fetch(`http://localhost:3000/api/auth/logout`,{
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authorization
      },
    });

    setAuth(false)
    setCookie('Bearer','', {path: '/', maxAge: 0 ,sameSite: true});

    const data = await res.json()

    await handleCloseUserMenu();
    await router.push('/auth/login')
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getActiveLink = (link) =>{
    return router.asPath.includes(link)
  }

  return (
    <AppBar className="sticky top-0 navbar-color z-50" position="static" color="inherit" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <a href='/home'>
            <Filter7TwoToneIcon fontSize='large' sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          </a>
            <Typography
              variant="h6"
              noWrap
              component="a"
              // href="/home"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              CodeNews
            </Typography> 


          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {auth ? (
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                <MenuItem fontFamily='monospace' 
                   onClick={() => router.push('/feed/category/politics/page/1')}
                >
                  <Typography textAlign="center">
                  politics
                  </Typography>
                </MenuItem>
                <MenuItem fontFamily='monospace' 
                   onClick={() => router.push('/feed/category/sport/page/1')}
                >
                  <Typography textAlign="center">
                  sport
                  </Typography>
                </MenuItem>
                <MenuItem fontFamily='monospace' 
                   onClick={() => router.push('/feed/category/events/page/1')}
                >
                  <Typography textAlign="center">
                  events
                  </Typography>
                </MenuItem>
                <MenuItem fontFamily='monospace' 
                   onClick={() => router.push('/feed/category/news/page/1')}
                >
                  <Typography textAlign="center">
                  news
                  </Typography>
                </MenuItem>
            </Menu>
            ) : (
              <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                <MenuItem fontFamily='monospace' 
                   onClick={() => router.push('/feed/category/politics/page/1')}
                >
                  <Typography textAlign="center">
                  politics
                  </Typography>
                </MenuItem>
                <MenuItem fontFamily='monospace'
                   onClick={() => router.push('/feed/category/sport/page/1')}
                >
                  <Typography textAlign="center">
                  sport
                  </Typography>
                </MenuItem>
                <MenuItem fontFamily='monospace' 
                   onClick={() => router.push('/feed/category/events/page/1')}
                >
                  <Typography textAlign="center">
                  events
                  </Typography>
                </MenuItem>
                <MenuItem fontFamily='monospace' 
                   onClick={() => router.push('/feed/category/news/page/1')}
                >
                  <Typography textAlign="center">
                  news
                  </Typography>
                </MenuItem>
                <MenuItem fontFamily='monospace'>
                  <Typography textAlign="center">
                  my articles
                  </Typography>
                </MenuItem>
            </Menu>
            )}
            
          </Box>
          <Filter7TwoToneIcon fontSize='medium' sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CodeNews
          </Typography>
          <Box 
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >{pages.map((page) => {
              const pageUrl = page.replace(" ", "-")
              return (
              <Button
                key={page}
                className={getActiveLink(pageUrl) ? "activeMenu": ""}
                onClick={() => router.push('/feed/category/' + pageUrl + '/page/1')}
                sx={{ my: 2, color: 'white', fontFamily: 'cursive', display: 'block' }}  
              >
                {page}
              </Button>
              )})
            }
            { auth && (

                // <Link href="/my-articles" passHref>
                  <Button
                      sx={{ my: 2, color: 'white', fontFamily: 'cursive', display: 'block' }}
                      className={getActiveLink('my-articles') ? "activeMenu" : ""}
                      onClick={() => {
                        router.push('/my-articles')
                      }}
                  >
                    my articles
                  </Button>
                // </Link>

            )}
            
           
          </Box>
          {
            !getActiveLink('/auth') && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp"
                      src=""
                      // src={`http://localhost:3000/api/auth/user-details/profile-image/${userId}`}
                    />
                  </IconButton>
                </Tooltip>
            
                {auth ? (
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                       onClick={() => {
                         router.push('/admin')
                         handleCloseUserMenu()
                       }}
                    >
                      {isAdmin && (<Typography textAlign="center">Admin Dash</Typography>)}
                    </MenuItem>
                    <MenuItem  onClick={handleCloseUserMenu}
                      onClick={() => router.push('/account')}
                    >
                      <Typography textAlign="center">Account</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                          router.push('/my-articles')
                          handleCloseUserMenu()
                        }}>
                    <Typography textAlign="center">My Articles</Typography>
                    </MenuItem>
                    <MenuItem  
                      onClick={handleLogOut}
                    >
                      <Typography textAlign="center">LogOut</Typography>
                    </MenuItem>

                  </Menu>
                ) : (
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem  
                      onClick={() => {
                        handleCloseUserMenu()
                        router.push('/auth/login')
                      }}
                    >
                      <Typography textAlign="center"> Login </Typography>
                    </MenuItem>

                  </Menu>
                  
                )}
          </Box>
            )
          }      
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;

export const getServerSideProps = async (context) => {
  const {req, res} = context
  const cookie = parseCookies(req)  

  if (res) {
    if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
      res.writeHead(301, { Location: "/" })
      res.end()
    }
  }

  const authorization = `Bearer ${cookie.Bearer}`

  return {      
    props: {
      authorization,
      cookie
    }  
  }
}