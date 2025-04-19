//Carousel.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Importa os estilos básicos
import 'swiper/css/navigation'; // Importa a navegação (setas)
import 'swiper/css/pagination'; // Importa a paginação (pontos)
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import styles from '.././Home.module.css'
export default function Carousel() {
    return (
        <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        allowTouchMove={true}
        autoplay={{
            delay: 3000,
            disableOnInteraction: false,
        }}
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        style={{
            '--swiper-navigation-color': 'white',
            '--swiper-pagination-color': 'white',
        }}
            className={styles.slider}
        >
            <SwiperSlide>
                <img src="./img/banner1.jpg" alt="Slide 1" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="./img/banner2.jpg" alt="Slide 2" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="./img/banner3.jpg" alt="Slide 3" />
            </SwiperSlide>
        </Swiper>
    );
}