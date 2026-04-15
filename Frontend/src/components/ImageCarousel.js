import Carousel from "react-bootstrap/Carousel";
import "../css/Home.css";

function ImageCarousel() {
  return (
    <Carousel  interval={2000}>
      <Carousel.Item>
        <img className="caro" src="/images/img1.webp" alt="First" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="caro" src="/images/img2.webp" alt="Second" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="caro" src="/images/img3.webp" alt="Third" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="caro" src="/images/img4.webp" alt="Fourth" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="caro" src="/images/img5.webp" alt="Fifth" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="caro" src="/images/img6.webp" alt="Sixth" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="caro" src="/images/img7.webp" alt="Seventh" />
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageCarousel;
