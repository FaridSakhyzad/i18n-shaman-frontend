import { useEffect, useState, useRef } from 'react';
import './Tooltip.scss';

interface IProps {
  content: string;
  anchor: string;
  nightMode?: boolean;
  size?: string;
}

export default function Tooltip ({ content, anchor, nightMode = false, size = 'normal' }: IProps) {
  const tooltipRef = useRef(null);

  const [ top, setTop ] = useState<number>(0);
  const [ left, setLeft ] = useState<number>(0);
  const [ isVisible, setIsVisible ] = useState<boolean>(false);
  const [ cssVisibility, setCssVisibility ] = useState<boolean>(false);

  const setTooltipPosition = () => {
    const $anchor = document.querySelector(anchor);

    if (!tooltipRef.current) {
      return;
    }

    const $tooltip = tooltipRef.current as HTMLElement;

    if (!$anchor || !$tooltip) {
      return;
    }

    const { width: anchorWidth, top: anchorTop, left: anchorLeft } = $anchor.getBoundingClientRect();

    const { width: tooltipWidth, height: tooltipHeight } = $tooltip.getBoundingClientRect();

    setTop(anchorTop - tooltipHeight);
    setLeft(anchorLeft + (anchorWidth / 2) - (tooltipWidth / 2));
  };

  const show = () => {
    setIsVisible(true);
    setTooltipPosition();

    setTimeout(() => {
      setCssVisibility(true);
    }, 0);
  }

  const hide = () => {
    setCssVisibility(false);
    setIsVisible(false);
  }

  const hideGradually = () => {
    setCssVisibility(false);

    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  }

  const attachHoverListener = () => {
    const $anchor = document.querySelector(anchor);

    if (!$anchor) {
      return;
    }

    $anchor.addEventListener('mouseover', show);
    $anchor.addEventListener('mouseout', hideGradually);
    window.addEventListener('scroll', hide);
  }

  const detachHoverListener = () => {
    const $anchor = document.querySelector(anchor);

    if (!$anchor) {
      return;
    }

    $anchor.removeEventListener('mouseover', show);
    $anchor.removeEventListener('mouseout', hideGradually);
    window.removeEventListener('scroll', hide);
  }

  useEffect(() => {
    attachHoverListener();

    return () => {
      detachHoverListener();
    }
  }, []);

  useEffect(() => {
    setTooltipPosition();
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <span
      ref={tooltipRef}
      className={`tooltip tm ${nightMode ? 'tooltip_nightMode' : ''} ${cssVisibility ? 'visible' : ''} tooltip_${size}`}
      style={{ top, left }}
    >{content}</span>
  )
}