import React from 'react';
import { Container, Typography, Avatar } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './About.css'; // Import the CSS file

function About() {
  const sectionStyle = { marginTop: '20px' };
  const detailStyle = { marginBottom: '10px' };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const teamMembers = [
    {
      name: 'Dewayne Barnes',
      role: 'Data Aggregation & API Specialist',
      background: "Computer and Information Science, Class of '25",
      hobbies: 'Pool, Basketball',
      description: 'Dewayne brings expertise in data aggregation and integration, focusing on research into APIs and scrapers to pull in reliable sports betting data.',
      image: '/images/dewayne.jpeg'
    },
    {
      name: 'Shiv Karnani',
      role: 'Finance & Probability Modeling',
      background: "Computer and Information Science & Finance, Class of '25",
      hobbies: 'Tennis, Soccer, Hiking',
      description: 'Shiv combines his knowledge of finance and CIS to contribute to developing probability models, ensuring our platform is financially sound and data-driven.',
      image: '/images/shiv.jpeg'
    },
    {
      name: 'Jason Figueroa',
      role: 'User Experience & Front-End Development',
      background: "Computer and Information Science, Class of '25",
      hobbies: 'Basketball, Cooking',
      description: 'Jason is instrumental in developing our arbitrage detection tools and analytics, providing users with calculated and insightful betting options.',
      image: '/images/jason.jpeg'
    },
    {
      name: 'Arnav Ghatiwala',
      role: 'AI & Machine Learning Insights',
      background: "Computer and Information Science, Class of '25",
      hobbies: 'Poker, Cricket, Traveling',
      description: 'Arnav is our AI specialist, focused on integrating machine learning insights into the platform to highlight profitable betting opportunities.',
      image: '/images/arnav.jpeg'
    },
    {
      name: 'Sarah Zhang',
      role: 'Arbitrage Detection & Data Analytics',
      background: "Computer and Information Science & Chemistry, Class of '25",
      hobbies: 'Sitting, Trying New Foods',
      description: 'Sarah leads our UX design and front-end development, ensuring our platform is user-friendly and intuitive for all types of users.',
      image: '/images/sarah.jpeg'
    },
  ];

  return (
    <Container component="main" maxWidth="md" className="about-container" style={{ marginTop: '20px' }}>
      <Typography component="h1" variant="h4" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to our project! We are a dedicated team of students from diverse backgrounds, united by a shared mission: to empower bettors with intelligent, data-driven tools for smarter decision-making. In today’s fast-paced betting landscape, it’s challenging to identify mispriced odds and high-value betting opportunities. Our platform is designed to solve this problem by combining advanced analytics, probability modeling, and AI insights, enabling users to make informed and profitable bets consistently.
      </Typography>
      <Typography component="h2" variant="h5" gutterBottom style={sectionStyle}>
        Our Mission
      </Typography>
      <Typography variant="body1" gutterBottom>
        We aim to create a comprehensive platform that aggregates and highlights betting opportunities, allowing bettors to access data-driven insights and avoid the pitfalls of mispriced odds. By leveraging APIs, developing robust models, and integrating AI, we’re building a platform that transforms data into actionable betting insights.
      </Typography>
      <Typography component="h2" variant="h5" gutterBottom style={sectionStyle}>
        Meet the Team
      </Typography>
      <Slider {...settings}>
        {teamMembers.map((member, index) => (
          <div key={index}>
            <Avatar alt={member.name} src={member.image} style={{ margin: 'auto', width: '100px', height: '100px' }} />
            <Typography variant="body1" gutterBottom style={detailStyle}>
              <strong>{member.name}</strong><br />
              <span style={{ fontWeight: 'bold' }}>Role:</span> {member.role}<br />
              <span style={{ fontWeight: 'bold' }}>Background:</span> {member.background}<br />
              <span style={{ fontWeight: 'bold' }}>Hobbies:</span> {member.hobbies}<br />
              {member.description}
            </Typography>
          </div>
        ))}
      </Slider>
    </Container>
  );
}

export default About;