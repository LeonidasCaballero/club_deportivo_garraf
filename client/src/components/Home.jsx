import { Typography, Container, Box } from '@mui/material';

const Home = () => {
    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Bienvenido a Club Deportivo Garraf
                </Typography>
                <Typography variant="body1">
                    Has iniciado sesión correctamente.
                </Typography>
            </Box>
        </Container>
    );
};

export default Home; 