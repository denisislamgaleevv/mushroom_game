export default class mainScene extends Phaser.Scene{
    constructor() {
    
        super('mainScene');
        this.ground;
        this.platforms;
        this.cursor;
        this.mushrooms;
        this.player;
        this.enemyDirection = 'left';
        this.enemy2Direction = 'left';
        this.enemy3Direction = 'right';
        this.mushrooms_small;
        this.playerHealth = 100;
        this.inventory = [];
        this.inventoryText;
        this.sword;
        this.haveSword = false; 
        this.poison;
        this.spores;
        this.lastSporeTime = 0;
        this.lastSporeTime2 = 0;
        this.lastSporeTime3 = 0;
        this.inventoryIcons = []; // Массив для хранения иконок инвентаря
    }
    
    preload(){
        this.load.image('sky', '../../assets/sky.png')
        this.load.image('ground', '../../assets/ground.png')
        this.load.image('platform', '../../assets/platform.jpg')
        this.load.image('mov_platform', '../../assets/platform.jpg')
        this.load.image('mushroom', '../../assets/mushroom.png')
        this.load.image('mushroom_small', '../../assets/mushroom_small.png')

        this.load.image('poison', '../../assets/sword.png')
        this.load.image('sword', '../../assets/sword.png')
        this.load.spritesheet('enemy', '../../assets/enemy/enemy.png', {frameWidth:32, frameHeight: 34})
        this.load.spritesheet('enemy2', '../../assets/enemy2/enemy2.png', {frameWidth:32, frameHeight: 33})
        this.load.spritesheet('enemy3', '../../assets/innocent/innocent.png',  {frameWidth:32, frameHeight: 33})
        this.load.spritesheet('player', '../../assets/player/player.png',{frameWidth: 32, frameHeight: 34} );

        this.load.audio('backgroundMusic', '../../assets/music.mp3');
        this.load.audio('deathMusic', '../../assets/kill.mp3');
    }

    create(){
        this.add.image(400,300, 'sky')
        this.ground = this.physics.add.staticGroup();
        this.ground.create(400,600, 'ground')
        this.platforms = this.physics.add.staticGroup();
        this.mushrooms = this.physics.add.staticGroup();
        this.mushrooms_small = this.physics.add.staticGroup();
        this.playerHealth = 100;   
    
        // Создаем группу для спор
        this.spores = this.physics.add.group({
            allowGravity: true,
            immovable: false,
            bounce: 0.8
        });
        
        this.mushrooms.create(580,350, 'mushroom');
        this.mushrooms.create(200,520, 'mushroom');
        this.mushrooms.create(155,150, 'mushroom');
        this.platforms.create(200,200, 'platform');
        this.platforms.create(300,350, 'platform');
        this.platforms.create(400,110, 'platform');
        this.platforms.create(700,190, 'platform');
        this.platforms.create(900,340, 'platform');
        this.platforms.create(550,400, 'platform');
        this.mushrooms_small.create(250,184, 'mushroom_small');
        this.mushrooms_small.create(1080,435, 'mushroom_small');
        this.platforms.create(1050,450, 'platform');
        
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.deathMusic = this.sound.add('deathMusic');
        this.backgroundMusic.play({loop: true});
        
        this.player = this.physics.add.sprite(100, 450, 'player')
        this.player.setCollideWorldBounds(true)
        this.player.setBounce(0.2)
      
        
        this.cursor = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.player, this.mushrooms)
        
        // Коллизия спор с платформами и землей
        this.physics.add.collider(this.spores, this.platforms);
        this.physics.add.collider(this.spores, this.ground);
        
        // Коллизия спор с игроком
        this.physics.add.overlap(this.player, this.spores, this.hitBySpore, null, this);
        
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'runEnemy',
            frames: this.anims.generateFrameNumbers('enemy',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'run2Enemy',
            frames: this.anims.generateFrameNumbers('enemy2',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'run3Enemy',
            frames: this.anims.generateFrameNumbers('enemy3',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        
        this.enemy = this.physics.add.sprite(500, 300, 'enemy');
        this.enemy2 = this.physics.add.sprite(550, 400, 'enemy');
        this.enemy3 = this.physics.add.sprite(900, 300, 'enemy3');
        
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setBounce(0.2);
        this.physics.add.collider(this.enemy, this.platforms);
        this.physics.add.collider(this.enemy, this.ground);
        this.physics.add.collider(this.enemy, this.mushrooms)
        
        this.enemy2.setCollideWorldBounds(true);
        this.enemy2.setBounce(0.2);
        this.enemy3.setCollideWorldBounds(true);
        this.enemy3.setBounce(0.2);
        
        this.physics.add.collider(this.enemy2, this.platforms);
        this.physics.add.collider(this.enemy2, this.ground);
        this.physics.add.collider(this.enemy2, this.mushrooms)
        this.physics.add.collider(this.enemy3, this.platforms);
        this.physics.add.collider(this.enemy3, this.ground);
        this.physics.add.collider(this.enemy3, this.mushrooms)
        
        this.sword = this.add.sprite(0,0, 'sword');
        this.sword.setVisible(false);

        this.player.sword = this.sword;
        this.sword.setOrigin(0.5,1);
        this.sword.setRotation(Phaser.Math.DegToRad(0));
        
        this.poison = this.physics.add.sprite(920, 100, 'poison');
        this.physics.add.collider(this.poison, this.ground);
        this.physics.add.collider(this.poison, this.platforms);
        this.physics.add.overlap(this.player, this.poison, this.collectItem, null, this);
        
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player', {
                start: 1,
                end: 3
            }),
            frameRate: 15,
            repeat: 0
        });
        
        this.physics.add.overlap(this.player, this.enemy, this.handleCollision, null, this);
        this.physics.add.overlap(this.player, this.enemy2, this.handleCollision, null, this);
        this.physics.add.overlap(this.player, this.enemy3, this.handleCollision, null, this);
        
        this.inventoryText = this.add.text(10,60, 'Inventory:', {
            font: '16px Arial',
            fill: '#ffffff'
        });
        
        this.createHealthBar();
        
        // Создаем графическую спору
        this.createSporeGraphic();
    }
    
    // Создаем маленькую спору
    createSporeGraphic() {
        const graphics = this.make.graphics();
        graphics.fillStyle(0x8B4513);
        graphics.fillCircle(5, 5, 5);
        graphics.fillStyle(0x654321);
        graphics.fillCircle(5, 5, 3);
        graphics.generateTexture('spore', 10, 10);
        graphics.destroy();
    }
    
    shootSpore(enemy, direction) {
        if (!enemy || !enemy.active) return;
        
        // Создаем спору
        const spore = this.spores.create(enemy.x, enemy.y, 'spore');
        if (!spore) return;
        
        spore.setScale(0.5); // Маленький размер
        spore.setBounce(0.9); // Высокий отскок
        spore.setCircle(4);
        spore.setCollideWorldBounds(true);
        
        // Направление полета
        const sporeSpeed = 120;
        if (direction === 'right') {
            spore.setVelocityX(sporeSpeed);
        } else {
            spore.setVelocityX(-sporeSpeed);
        }
        
        // Высокий прыжок споры
        spore.setVelocityY(Phaser.Math.Between(-200, -250));
        
        // Удаляем спору через 5 секунд
        this.time.delayedCall(5000, () => {
            if (spore && spore.active) {
                spore.destroy();
            }
        });
    }
    
    hitBySpore(player, spore) {
        spore.destroy();
        this.playerHealth -= 10;
        
        if (this.playerHealth <= 0) {
            this.playerHealth = 0;
            this.restartGame();
        }
        
        this.updateHealthBar();
        
        // Эффект мигания
        this.tweens.add({
            targets: this.player,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.player.alpha = 1;
            }
        });
    }
    
    attackEnemy(sword, enemy){
        if (enemy.active && this.cursor.space.isDown) {
            enemy.disableBody(true, true);
            this.deathMusic.play({loop: false});
            return true;
        }
        return false;
    }
    
    attackEnemy2(sword, enemy2){
        if (enemy2.active && this.cursor.space.isDown) {
            enemy2.disableBody(true, true);
            this.deathMusic.play({loop: false});
            return true;
        }
        return false;
    }
    
    attackEnemy3(sword, enemy3){
        if (enemy3.active && this.cursor.space.isDown) {
            enemy3.disableBody(true, true);
            this.deathMusic.play({loop: false});
            return true;
        }
        return false;
    }
    
    collectItem(player, item) {
        item.disableBody(true, true);
        this.inventory.push(item.texture.key);
        this.updateInventoryDisplay();
        this.haveSword = true;
    }
    
    updateInventoryDisplay() {
        this.inventoryText.setText('Inventory:');
        
        // Очищаем старые иконки
        if (this.inventoryIcons) {
            this.inventoryIcons.forEach(icon => icon.destroy());
        }
        this.inventoryIcons = [];
        
        this.inventory.forEach((item, index) => {
            if (item === 'poison') {
                const itemImage = this.add.image(100 + index * 40, 70, item);
                itemImage.setScale(0.8);
                this.inventoryIcons.push(itemImage);
            }
        });
    }
    
    createHealthBar() {
        this.healthBar = this.add.graphics();
        this.updateHealthBar();
    }

    updateHealthBar() {
        if (this.playerHealth <= 0) {
            this.playerHealth = 0;
        }

        const x = 10;
        const y = 10;
        const width = 200; 
        const height = 20;

        this.healthBar.clear();
        this.healthBar.fillStyle(0x177245);
        this.healthBar.fillRect(x, y, width * (this.playerHealth / 100), height);
        this.healthBar.lineStyle(2, 0x000000);
        this.healthBar.strokeRect(x, y, width, height);
    }

    handleCollision(player, enemy) {
        this.playerHealth -= 10;
        
        if (this.playerHealth <= 0) {
            this.restartGame();
        }
        
        this.updateHealthBar();
        
        // Отбрасывание игрока
        if (player.x < enemy.x) {
            player.setVelocityX(-200);
        } else {
            player.setVelocityX(200);
        }
        player.setVelocityY(-150);
    }

    restartGame() {
        // Останавливаем музыку
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        
        // Очищаем инвентарь
        this.inventory = [];
        this.haveSword = false;
        
        // Очищаем иконки инвентаря
        if (this.inventoryIcons) {
            this.inventoryIcons.forEach(icon => icon.destroy());
            this.inventoryIcons = [];
        }
        
        // Обновляем отображение инвентаря
        if (this.inventoryText) {
            this.inventoryText.setText('Inventory:');
        }
        
        // Сбрасываем здоровье
        this.playerHealth = 100;
        
        // Перезагружаем сцену
        this.scene.restart();
    }

    update(time, delta){
        // Проверяем коллизии с врагами для урона
        this.physics.add.overlap(this.player, this.enemy, this.handleCollision, null, this);
        this.physics.add.overlap(this.player, this.enemy2, this.handleCollision, null, this);
        this.physics.add.overlap(this.player, this.enemy3, this.handleCollision, null, this);
        
        // Враг 1
        if (this.enemy.active) {
            if (this.enemyDirection === 'right') {
                this.enemy.setVelocityX(80);
                if(this.enemy.body.touching.down){
                    this.enemy.setVelocityY(-80);
                }
                this.enemy.flipX = false;
                this.enemy.anims.play('runEnemy', true);
            } else if (this.enemyDirection === 'left') {
                this.enemy.setVelocityX(-80);
                if(this.enemy.body.touching.down){
                    this.enemy.setVelocityY(-80);
                }
                this.enemy.flipX = true;
                this.enemy.anims.play('runEnemy', true);
            }
            
            if (this.enemy.body.blocked.right) {
                this.enemyDirection = 'left';
            } else if (this.enemy.body.blocked.left) {
                this.enemyDirection = 'right';
            }
            
            // Выстрел спорой каждые 2 секунды
            if (time > this.lastSporeTime + 2000) {
                this.shootSpore(this.enemy, this.enemyDirection);
                this.lastSporeTime = time;
            }
        }

        // Враг 2
        if (this.enemy2.active) {
            if (this.enemy2Direction === 'right') {
                this.enemy2.setVelocityX(80);
                this.enemy2.flipX = false;
                this.enemy2.anims.play('run2Enemy', true);
            } else if (this.enemy2Direction === 'left') {
                this.enemy2.setVelocityX(-80);
                this.enemy2.flipX = true;
                this.enemy2.anims.play('run2Enemy', true);
            }
            
            if (this.enemy2.body.blocked.right) {
                this.enemy2Direction = 'left';
            } else if (this.enemy2.body.blocked.left) {
                this.enemy2Direction = 'right';
            }
            
            if (time > this.lastSporeTime2 + 2000) {
                this.shootSpore(this.enemy2, this.enemy2Direction);
                this.lastSporeTime2 = time;
            }
        }

        // Враг 3
        if (this.enemy3.active) {
            if (this.enemy3Direction === 'right') {
                this.enemy3.setVelocityX(80);
                this.enemy3.flipX = false;
                this.enemy3.anims.play('run3Enemy', true);
            } else if (this.enemy3Direction === 'left') {
                this.enemy3.setVelocityX(-80);
                this.enemy3.flipX = true;
                this.enemy3.anims.play('run3Enemy', true);
            }
            
            if (this.enemy3.body.blocked.right) {
                this.enemy3Direction = 'left';
            } else if (this.enemy3.body.blocked.left) {
                this.enemy3Direction = 'right';
            }
            
            if (time > this.lastSporeTime3 + 3000) {
                this.shootSpore(this.enemy3, this.enemy3Direction);
                this.lastSporeTime3 = time;
            }
        }

        // Управление игроком
        if(this.cursor.left.isDown ){
            this.player.setVelocityX(-160);
            this.player.anims.play('run', true);
            this.player.flipX = true;
        }
        else if (this.cursor.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('run', true); 
            this.player.flipX = false;
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
            this.player.setTexture('player', 0);
        }
        
        if(this.cursor.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
        
        // Меч - позиционирование
        if (this.player.flipX === false) {
            this.sword.setPosition(this.player.x+15, this.player.y+5);
            this.sword.flipX = false;
            this.sword.setOrigin(0.5, 0.8);
        }
        else{
            this.sword.setPosition(this.player.x-15, this.player.y+5);
            this.sword.flipX = true;
            this.sword.setOrigin(0.5, 0.8);
        }
        
        // Атака мечом и убийство врагов
        if (this.cursor.space.isDown && this.haveSword) {
            this.player.anims.play('attack', true);
            this.sword.setVisible(true);
            
            // Вращение меча
            if (this.sword.flipX == true){
                this.sword.setRotation(this.sword.rotation - 0.15);
            }
            else{
                this.sword.setRotation(this.sword.rotation + 0.15);
            }
            
            // Проверка попадания по врагам с помощью getBounds
            const swordBounds = this.sword.getBounds();
            
            // Враг 1
            if (this.enemy.active && Phaser.Geom.Intersects.RectangleToRectangle(swordBounds, this.enemy.getBounds())) {
                this.enemy.disableBody(true, true);
                this.deathMusic.play({loop: false});
            }
            
            // Враг 2
            if (this.enemy2.active && Phaser.Geom.Intersects.RectangleToRectangle(swordBounds, this.enemy2.getBounds())) {
                this.enemy2.disableBody(true, true);
                this.deathMusic.play({loop: false});
            }
            
            // Враг 3
            if (this.enemy3.active && Phaser.Geom.Intersects.RectangleToRectangle(swordBounds, this.enemy3.getBounds())) {
                this.enemy3.disableBody(true, true);
                this.deathMusic.play({loop: false});
            }
            
            // Сброс вращения меча после полного оборота
            const angle = Math.abs(this.sword.rotation);
            if (angle > 2){
                this.sword.setRotation(Phaser.Math.DegToRad(0));
            }
        } else {
            this.sword.setVisible(false);
            this.sword.setRotation(Phaser.Math.DegToRad(0)) 
        }
    }
}