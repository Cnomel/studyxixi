import { ipcRenderer } from 'electron';
import { delay } from './utils';
import { config } from './config';
import { userInfoUrl, examIndexUrl } from './urls';

export const getUserInfo = async () => {
  const res = await fetch(userInfoUrl , {
    credentials: 'include',
    referrer: examIndexUrl,
  });
  const rs = await res.json();
  if (rs.code !== 200) {
    throw new Error(rs.error);
  }
  return rs.data;
}

export const onLogin = async () => {
	const $layoutBody = document.querySelector('.layout-body') as HTMLElement;
  // 隐藏页面无用的元素
  document.body.style.overflow = 'hidden';
  document
    .querySelectorAll('.layout-header, .redflagbox, .layout-footer, .oath')
    .forEach((element: HTMLElement) => {
      element.style.display = 'none';
    });

	$layoutBody.classList.remove('login-page-bg');

	document
		.querySelectorAll('.login-page-bg')
		.forEach((element: HTMLElement) => {
			console.log(element)
			element.style.backgroundImage = '';
		});

  // 调整页面样式
  [document.documentElement, document.body].forEach((element: HTMLElement) => {
    element.style.minWidth = 'unset';
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    element.style.background = '#333333';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = 'cover';
  });

	const callback = () => {
		const text = `${config.tipsPrefix}打开APP扫它👆`;
    const $loginText = document.querySelector('.ddlogintext');
		if ($loginText) {
			$loginText.innerHTML = text;
			($loginText as HTMLElement).style.color = '#fff';
		}
		// 关闭闪屏页
		ipcRenderer.send('close-win-splash');
	}

  const observer = new MutationObserver(() => {
    callback();
		observer.disconnect();
  });

  observer.observe($layoutBody, { subtree: true, childList: true });

	setTimeout(() => {
		callback();
	}, 8000);
};

export const isLoggedIn = () => {
  return document.cookie.includes('token=');
};
