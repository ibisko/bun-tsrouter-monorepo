import type { SVGProps } from 'react';

/** bubbles:add-outline */
export function BubblesAddOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M.75 12h22.5M12 .75v22.5" />
    </svg>
  );
}
