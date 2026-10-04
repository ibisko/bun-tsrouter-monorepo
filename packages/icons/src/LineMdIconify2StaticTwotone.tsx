import type { SVGProps } from 'react';

/** line-md:iconify2-static-twotone */
export function LineMdIconify2StaticTwotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <defs>
        <mask id="SVGMxc5dc3l">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <g stroke="#fff">
              <path strokeWidth="1.5" d="M3.25 22.25h17.5" opacity=".33" />
              <g strokeWidth="2">
                <path d="M7 6v-3" opacity=".33" />
                <path d="M5 8v11h14v-11" opacity=".6" />
              </g>
            </g>
            <path stroke="#000" strokeWidth="4" d="M12 16v4.5M12 3l8.5 5.5" />
            <path stroke="#fff" strokeWidth="2" d="M12 3l8.5 5.5" opacity=".6" />
            <path stroke="#000" strokeWidth="4" d="M12 3l-8.5 5.5" />
            <g stroke="#fff" strokeWidth="2">
              <path d="M12 3l-8.5 5.5" opacity=".6" />
              <path d="M12 11.5v9" />
            </g>
          </g>
          <circle cx="12" cy="11.5" r="3.5" />
        </mask>
      </defs>
      <g fill="currentColor">
        <path d="M0 0h24v24H0z" mask="url(#SVGMxc5dc3l)" />
        <circle cx="12" cy="11.5" r="1.5" />
      </g>
    </svg>
  );
}
