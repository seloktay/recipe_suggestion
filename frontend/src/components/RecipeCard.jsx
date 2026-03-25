import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function RecipeCard({recipe}) {
    const categories = recipe.categories
    console.log(recipe)
    const categoryBoxes = (
        <div>
            {
                categories.map(category => (
                    <Box key = {category}>
                        {category}
                    </Box>
                ))
            }
        </div>
    )
    return (
        <Card sx={{ minWidth: 275 }}>
          <CardMedia
            sx={{ height: 140 }}
            image={recipe.image}
            title="green iguana"
          />
          <CardContent>
            <Box>
                {categoryBoxes}
            </Box>
            <Typography variant="h5" component="div">
                {recipe.name}
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
    )

}

export default RecipeCard;