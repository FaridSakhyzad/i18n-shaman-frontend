import React, { useEffect, useState, useRef } from 'react';
import './Tooltip.scss';

interface IProps {
  content: string;
  anchor: string;
  nightMode?: boolean;
  size?: string;
}

export default function Tooltip({
  content,
  anchor,
  nightMode = false,
  size = 'normal',
}: IProps) {
  const tooltipRef = useRef(null);

  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [cssVisibility, setCssVisibility] = useState<boolean>(false);

  const [currentTargetData, setCurrentTargetData] = useState<any>(null);
  const currentTargetDataRef = useRef(null);
  currentTargetDataRef.current = currentTargetData;

  const setTooltipPosition = () => {
    const targetData = currentTargetDataRef.current;

    if (!tooltipRef.current) {
      return;
    }

    const $tooltip = tooltipRef.current as HTMLElement;

    if (!targetData || !$tooltip) {
      return;
    }

    const { width: anchorWidth, top: anchorTop, left: anchorLeft } = targetData;

    const { width: tooltipWidth, height: tooltipHeight } = $tooltip.getBoundingClientRect();

    setTop(anchorTop - tooltipHeight);
    setLeft(anchorLeft + (anchorWidth / 2) - (tooltipWidth / 2));
  };

  const show = (e: Event) => {
    setIsVisible(true);

    const { target: $target } = e as Event & { target: HTMLElement };

    if (!$target) {
      return;
    }

    setCurrentTargetData($target.getBoundingClientRect());

    setTooltipPosition();

    setTimeout(() => {
      setCssVisibility(true);
    }, 0);
  };

  const hide = () => {
    setCssVisibility(false);
    setIsVisible(false);
  };

  const hideGradually = () => {
    setCssVisibility(false);
    currentTargetDataRef.current = null;

    setIsVisible(false);
  };

  const attachHoverListener = () => {
    const $anchors = document.querySelectorAll(anchor);

    if ($anchors.length < 1) {
      return;
    }

    $anchors.forEach(($anchor) => {
      $anchor.addEventListener('mouseover', show);
      $anchor.addEventListener('mouseout', hideGradually);
    });

    window.addEventListener('scroll', hide);
  };

  const detachHoverListener = () => {
    const $anchors = document.querySelectorAll(anchor);

    if ($anchors.length < 1) {
      return;
    }

    $anchors.forEach(($anchor) => {
      $anchor.removeEventListener('mouseover', show);
      $anchor.removeEventListener('mouseout', hideGradually);
    });

    window.removeEventListener('scroll', hide);
  };

  useEffect(() => {
    attachHoverListener();

    return () => {
      detachHoverListener();
    };
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
    >
      {content}
    </span>
  );
}
