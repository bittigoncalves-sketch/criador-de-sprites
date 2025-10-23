import React from 'react';

const BaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {props.children}
  </svg>
);

export const Icon = {
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></BaseIcon>
  ),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455L12.75 18l1.177-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.177a3.375 3.375 0 002.455 2.455L20.25 18l-1.177.398a3.375 3.375 0 00-2.455 2.455z" /></BaseIcon>
  ),
  Wand: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.21 1.002L7.5 15.25m5.25-12.146v5.714a2.25 2.25 0 00.21 1.002l2.25 5.444" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75a2.25 2.25 0 002.25-2.25v-5.444l2.25-5.444a2.25 2.25 0 00-2.1-3.002H9.75a2.25 2.25 0 00-2.1 3.002l2.25 5.444v5.444A2.25 2.25 0 0012 21.75z" /></BaseIcon>
  ),
  Video: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l.007-.007.007.007-.007.007-.007-.007zM18.75 4.5l.007.007-.007.007.007-.007-.007-.007zM16.5 19.5l.007.007-.007.007.007-.007-.007-.007zM18.75 19.5l-.007-.007.007-.007.007.007-.007.007zM16.5 4.5l-.007.007.007.007.007-.007-.007-.007zM12 2.25l.007.007-.007.007.007-.007-.007-.007zM12 21.75l-.007-.007.007-.007.007.007-.007.007zM4.5 7.5l-.007.007.007.007.007-.007-.007-.007zM7.5 4.5l.007.007-.007.007.007-.007-.007-.007zM7.5 19.5l-.007-.007.007-.007.007.007-.007.007zM4.5 17.25l.007-.007.007.007-.007.007-.007-.007z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12z" /></BaseIcon>
  ),
  Image: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></BaseIcon>
  ),
  Scan: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" /></BaseIcon>
  ),
  Chat: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></BaseIcon>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
     <BaseIcon {...props} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></BaseIcon>
  ),
  Brain: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455L12.75 18l1.177-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.177a3.375 3.375 0 002.455 2.455L20.25 18l-1.177.398a3.375 3.375 0 00-2.455 2.455z" /></BaseIcon>
  ),
  Send: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></BaseIcon>
  ),
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></BaseIcon>
  ),
  Key: (props: React.SVGProps<SVGSVGElement>) => (
    <BaseIcon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></BaseIcon>
  ),
};