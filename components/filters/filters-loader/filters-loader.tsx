import React from "react";
import "./filters-loader.scss"; // Import your CSS file for styling

interface LoaderProps {
  items: number;
  orientation: string;
}
const LoadingBox: React.FC<LoaderProps> = ({ items, orientation }) => {
  if (orientation === "horizontal") {
    const divs = Array.from({ length: items }, (_, index) => (
      <div className="loading-select-row" key={index}>
        <div className="shimmer"></div>
      </div>
    ));
    return <div className="loading-box-row">{divs}</div>;
  }
  if (orientation === "vertical") {
    const divs = Array.from({ length: items }, (_, index) => (
      <div className="loading-select-column" key={index}>
        <div className="shimmer"></div>
      </div>
    ));
    return <div className="loading-box">{divs}</div>;
  }
};

export default LoadingBox;
