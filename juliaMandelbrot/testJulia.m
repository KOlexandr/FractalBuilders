function testJulia
    size = 400;
    figure;
    julia(-1, 0, size);
    figure;
    julia(-0.25, 0.75, size);
    figure;
    julia(-0.2, 0.75, size);
    figure;
    julia(-0.1244, 0.7560, size);
    figure;
    julia(-0.1194, 0.6289, size);
    
    figure;
    julia(0.25, 0.52, size);
    figure;
    julia(0.377, -0.248, size);
    figure;
    julia(-0.7382, 0.0827, size);
    figure;
    julia(0.31, 0.04, size);
    
    figure;
    julia(-0.5, 0.156, size);
    figure;
    julia(-0.4, 0.6, size);
end