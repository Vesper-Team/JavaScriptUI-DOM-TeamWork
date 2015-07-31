# Telerik Vesper Team

# JavaScriptUI-DOM-TeamWork

## Classic Backgammon

### Vesper Team Members

| Име      | TA  nickname       | Github  |
| ------------- |:-------------:| -----:|
| Огнян Коссов  | kossov | kossov |
| Мартин Кръстев    | mr.krustevv      |   mr-krustev |
| Мартин Атанасов | jumarto     |    juvemar |
| Драгомир Тачев | Dragomir.Tachev     |    DragomirTachev |
| Борислав Георгиев | Boray      |    Borayvor |
| Еса Вехманен | Essobar      |    Essobar |
| Кирил Колев | kiko81      |    kiko81  |

Game story
This is classical backgammon game that is played directly into your browser. It is a two player game. On welcome screen player can choose to start the game or quit and exit web page. 
First of all each player rolls a dice and the player with bigger dice should throw first. Each player rolls a couple of dices. If a player rolls a pair he moves one more time and should roll the dices again.
 
 Each player chooses checkers color (black or white) and has to move counterclockwise his checkers from the top right corner to the bottom left one and after that get out all of them. The checkers movement Is according to the picture above.





	



Implementation
The animation of the Menus are made using jQuery and SVG.
The game is developed using JavaScript and some additional frameworks.
 It is used KineticJS to operate with the canvas elements.
The dices are generated with jQuery. It is used a sprite to generate their rolling animation. Their last value is preserved to be used in the program and game logic.
The checkers are also done using KineticJS. They are circle objects with given fill and stroke. They are drawn by functions. As arguments the drawing functions take color of the checker, count of the checkers and their coordinates.
SweetAlert is used for the user game assistance


##### for more info see provided [documentation](https://github.com/Vesper-Team/JavaScriptUI-DOM-TeamWork/blob/master/Documentation.docx)

